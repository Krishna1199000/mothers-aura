import db from "@/lib/prisma";
import { fetchAllDiamonds, CleanDiamond } from "./cranberri-diamonds";
import { PrismaClient } from "@prisma/client";

const BATCH_SIZE = 100; // Process 100 diamonds at a time

interface SyncProgress {
  totalDiamonds: number;
  processed: number;
  status: string;
  message?: string;
}

export async function syncCranberriDiamondsBatch() {
  let syncRecord;
  try {
    console.log("Starting Cranberri batch sync...");

    syncRecord = await db.cranberriSync.create({
      data: {
        lastSyncAt: new Date(),
        status: "IN_PROGRESS",
        message: "Starting to fetch all diamonds from Cranberri API...",
      },
    });

    console.log("Created sync record:", syncRecord.id);

    // Update progress during fetching
    await db.cranberriSync.update({
      where: { id: syncRecord.id },
      data: {
        message: "Fetching diamonds from all pages...",
      },
    });

    const allDiamonds = await fetchAllDiamonds();
    console.log(`Fetched ${allDiamonds.length} diamonds from Cranberri API`);
    
    // Create a better unique key for diamonds using multiple properties
    const createUniqueKey = (diamond: any) => {
      return `${diamond.stockId}-${diamond.size}-${diamond.color}-${diamond.clarity}-${diamond.shape}-${diamond.lab}`;
    };

    // Analyze uniqueness with better key
    const uniqueKeys = allDiamonds.map(createUniqueKey);
    const uniqueKeySet = [...new Set(uniqueKeys)];
    const actualDuplicates = uniqueKeys.length - uniqueKeySet.length;
    
    console.log(`\n🔍 DETAILED DIAMOND ANALYSIS:`);
    console.log(`📊 Total diamonds fetched: ${allDiamonds.length}`);
    console.log(`🔑 Unique combinations (stockId + size + color + clarity + shape + lab): ${uniqueKeySet.length}`);
    console.log(`🔄 Actual duplicates found: ${actualDuplicates}`);
    
    // Show stockId analysis for comparison
    const stockIds = allDiamonds.map(d => d.stockId);
    const uniqueStockIds = [...new Set(stockIds)];
    const stockIdDuplicates = stockIds.length - uniqueStockIds.length;
    console.log(`📋 StockId-only analysis: ${stockIds.length} total, ${uniqueStockIds.length} unique, ${stockIdDuplicates} duplicates`);
    
    if (stockIdDuplicates > 0) {
      console.log(`⚠️  StockIds that appear multiple times:`, uniqueStockIds.filter(id => 
        stockIds.filter(sid => sid === id).length > 1
      ));
      
      // Show examples of diamonds with same stockId but different properties
      const duplicateStockIds = uniqueStockIds.filter(id => 
        stockIds.filter(sid => sid === id).length > 1
      );
      
      duplicateStockIds.slice(0, 3).forEach(stockId => {
        const diamondsWithSameId = allDiamonds.filter(d => d.stockId === stockId);
        console.log(`\n📋 Example: StockId "${stockId}" appears ${diamondsWithSameId.length} times:`);
        diamondsWithSameId.forEach((diamond, index) => {
          console.log(`   ${index + 1}. Size: ${diamond.size}, Color: ${diamond.color}, Clarity: ${diamond.clarity}, Shape: ${diamond.shape}`);
        });
      });
    }
    
    // Deduplicate using the better unique key (keep the latest one based on createdAt)
    const deduplicatedDiamonds = allDiamonds.reduce((acc, diamond) => {
      const uniqueKey = createUniqueKey(diamond);
      const existing = acc.find(d => createUniqueKey(d) === uniqueKey);
      
      if (!existing) {
        acc.push(diamond);
      } else {
        // Keep the one with the latest createdAt
        const existingCreatedAt = new Date(existing.createdAt || 0);
        const currentCreatedAt = new Date(diamond.createdAt || 0);
        
        if (currentCreatedAt > existingCreatedAt) {
          const index = acc.findIndex(d => createUniqueKey(d) === uniqueKey);
          acc[index] = diamond;
          console.log(`🔄 Updated diamond with key "${uniqueKey}" (newer timestamp)`);
        } else {
          console.log(`⏭️  Skipped older diamond with key "${uniqueKey}"`);
        }
      }
      return acc;
    }, [] as typeof allDiamonds);
    
    console.log(`\n✅ DEDUPLICATION RESULTS:`);
    console.log(`📥 Input diamonds: ${allDiamonds.length}`);
    console.log(`📤 Output diamonds: ${deduplicatedDiamonds.length}`);
    console.log(`🗑️  Removed duplicates: ${allDiamonds.length - deduplicatedDiamonds.length}`);
    console.log(`🎯 Unique diamonds to sync: ${deduplicatedDiamonds.length}`);
    
    // Use deduplicated diamonds for processing
    const diamondsToProcess = deduplicatedDiamonds;

    await db.cranberriSync.update({
      where: { id: syncRecord.id },
      data: {
        totalDiamonds: allDiamonds.length,
        message: `Fetched ${allDiamonds.length} diamonds from all pages. Starting batch processing...`,
      },
    });

    console.log("Using upsert to handle existing Cranberri diamonds...");

    let processedCount = 0;
    for (let i = 0; i < diamondsToProcess.length; i += BATCH_SIZE) {
      const batch = diamondsToProcess.slice(i, i + BATCH_SIZE);
      console.log(`Processing batch ${i / BATCH_SIZE + 1}/${Math.ceil(diamondsToProcess.length / BATCH_SIZE)} (${batch.length} diamonds)...`);

      // Use upsert for each diamond to handle duplicates properly (without transaction to avoid timeout)
      let insertedCount = 0;
      let updatedCount = 0;
      
      for (const diamond of batch) {
        try {
          // Use a composite unique key for better uniqueness detection
          // We'll use stockId as the primary key but log the full unique key for debugging
          const uniqueKey = `${diamond.stockId}-${diamond.size}-${diamond.color}-${diamond.clarity}-${diamond.shape}-${diamond.lab}`;
          
          const result = await db.cranberriDiamond.upsert({
            where: { stockId: diamond.stockId },
            update: {
              shape: diamond.shape,
              size: diamond.size,
              color: diamond.color,
              clarity: diamond.clarity,
              cut: diamond.cut,
              polish: diamond.polish,
              sym: diamond.sym,
              lab: diamond.lab,
              certificateNo: diamond.certificateNo,
              pricePerCarat: diamond.pricePerCarat,
              finalAmount: diamond.finalAmount,
              imageUrl: diamond.imageUrl,
              certUrl: diamond.certUrl,
              videoUrl: diamond.videoUrl,
              createdAt: new Date(diamond.createdAt),
            },
            create: {
              id: diamond.id,
              stockId: diamond.stockId,
              shape: diamond.shape,
              size: diamond.size,
              color: diamond.color,
              clarity: diamond.clarity,
              cut: diamond.cut,
              polish: diamond.polish,
              sym: diamond.sym,
              lab: diamond.lab,
              certificateNo: diamond.certificateNo,
              pricePerCarat: diamond.pricePerCarat,
              finalAmount: diamond.finalAmount,
              imageUrl: diamond.imageUrl,
              certUrl: diamond.certUrl,
              videoUrl: diamond.videoUrl,
              createdAt: new Date(diamond.createdAt),
            },
          });
          
          // Check if this was an insert or update by checking if the createdAt was just set
          if (result.createdAt.getTime() === new Date(diamond.createdAt).getTime()) {
            insertedCount++;
            console.log(`✅ INSERTED: ${uniqueKey}`);
          } else {
            updatedCount++;
            console.log(`🔄 UPDATED: ${uniqueKey}`);
          }
        } catch (error) {
          console.error(`❌ Error upserting diamond`, error);
          // Continue with next diamond
        }
      }
      
      console.log(`\n📊 Batch ${i / BATCH_SIZE + 1} results:`);
      console.log(`   ✅ Inserted: ${insertedCount} diamonds`);
      console.log(`   🔄 Updated: ${updatedCount} diamonds`);
      console.log(`   📋 Total processed: ${insertedCount + updatedCount} diamonds`);

      processedCount += batch.length;
      await db.cranberriSync.update({
        where: { id: syncRecord.id },
        data: {
          processed: processedCount,
          message: `Processed ${processedCount}/${allDiamonds.length} diamonds.`,
        },
      });
      console.log(`Batch processed. Total processed: ${processedCount}`);
    }

    // Check actual count in database
    const actualCount = await db.cranberriDiamond.count();
    console.log(`Actual diamonds in database after sync: ${actualCount}`);

    await db.cranberriSync.update({
      where: { id: syncRecord.id },
      data: {
        status: "COMPLETED",
        message: `Successfully synced ${actualCount} diamonds (${diamondsToProcess.length} unique from ${allDiamonds.length} total).`,
        diamondsCount: actualCount,
      },
    });

    console.log(`\n🎉 CRANBERRI SYNC COMPLETED SUCCESSFULLY!`);
    console.log(`📊 Final Summary:`);
    console.log(`   📥 Total diamonds fetched from API: ${allDiamonds.length}`);
    console.log(`   🔍 Unique diamonds after deduplication: ${diamondsToProcess.length}`);
    console.log(`   💾 Diamonds in database: ${actualCount}`);
    console.log(`   ⏱️  Execution time: ${Date.now() - syncRecord.createdAt.getTime()}ms`);
    
    if (actualCount === diamondsToProcess.length) {
      console.log(`✅ Perfect sync: All unique diamonds successfully stored!`);
    } else {
      console.log(`⚠️  Warning: Database count (${actualCount}) doesn't match unique count (${diamondsToProcess.length})`);
    }
    
    return {
      success: true,
      message: `Successfully synced ${actualCount} diamonds (${diamondsToProcess.length} unique from ${allDiamonds.length} total)`,
      syncId: syncRecord.id,
      stats: {
        totalFetched: allDiamonds.length,
        uniqueDiamonds: diamondsToProcess.length,
        databaseCount: actualCount,
        executionTime: Date.now() - syncRecord.createdAt.getTime()
      }
    };
  } catch (error: unknown) {
    console.error("Error syncing Cranberri diamonds:", error);

    if (syncRecord) {
      await db.cranberriSync.update({
        where: { id: syncRecord.id },
        data: {
          status: "FAILED",
          message: error instanceof Error ? error.message : 'Unknown error occurred',
        },
      });
    }

    return {
      success: false,
      message: `Failed to sync diamonds: ${error instanceof Error ? error.message : 'Unknown error occurred'}`,
      error: error instanceof Error ? error : new Error('Unknown error occurred'),
    };
  }
}
