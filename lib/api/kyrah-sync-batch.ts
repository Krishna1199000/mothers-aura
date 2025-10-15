import db from "@/lib/prisma";
import { fetchKyrahDiamonds } from "./diamonds";

interface SyncProgress {
  totalDiamonds: number;
  processedDiamonds: number;
  currentBatch: number;
  totalBatches: number;
  status: 'STARTING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  message?: string;
}

const BATCH_SIZE = 100; // Process 100 diamonds at a time

export async function syncKyrahDiamondsBatch() {
  let syncRecord;
  const progress: SyncProgress = {
    totalDiamonds: 0,
    processedDiamonds: 0,
    currentBatch: 0,
    totalBatches: 0,
    status: 'STARTING'
  };

  try {
    console.log("Starting batch Kyrah sync...");
    
    // Create a new sync record
    syncRecord = await db.kyrahSync.create({
      data: {
        lastSyncAt: new Date(),
        status: "IN_PROGRESS",
      },
    });

    console.log("Created sync record:", syncRecord.id);

    // Fetch all diamonds from Kyrah API
    console.log("Fetching diamonds from Kyrah API...");
    const allDiamonds = await fetchKyrahDiamonds();
    
    if (allDiamonds.length === 0) {
      console.log("No diamonds found in API response");
      await db.kyrahSync.update({
        where: { id: syncRecord.id },
        data: {
          status: "COMPLETED",
          message: "No diamonds found in API response",
          diamondsCount: 0,
        },
      });
      
      return {
        success: true,
        message: "No diamonds found in API response",
        syncId: syncRecord.id,
        progress,
      };
    }

    progress.totalDiamonds = allDiamonds.length;
    progress.totalBatches = Math.ceil(allDiamonds.length / BATCH_SIZE);
    progress.status = 'IN_PROGRESS';

    console.log(`Fetched ${allDiamonds.length} diamonds from API`);
    console.log(`Will process in ${progress.totalBatches} batches of ${BATCH_SIZE}`);

    // Clear existing diamonds first
    await db.kyrahDiamond.deleteMany({});
    console.log("Cleared existing Kyrah diamonds");

    // Process diamonds in batches
    for (let i = 0; i < allDiamonds.length; i += BATCH_SIZE) {
      progress.currentBatch = Math.floor(i / BATCH_SIZE) + 1;
      progress.processedDiamonds = i;
      
      const batch = allDiamonds.slice(i, i + BATCH_SIZE);
      
      console.log(`Processing batch ${progress.currentBatch}/${progress.totalBatches} (${batch.length} diamonds)`);
      
      // Insert batch
      await db.kyrahDiamond.createMany({
        data: batch.map(diamond => ({
          id: diamond.id,
          stockId: diamond.stockId,
          shape: diamond.shape,
          carat: diamond.carat,
          color: diamond.color,
          clarity: diamond.clarity,
          cut: diamond.cut,
          polish: diamond.polish,
          symmetry: diamond.symmetry,
          lab: diamond.lab,
          pricePerCarat: diamond.pricePerCarat,
          amount: diamond.amount,
          imageUrl: diamond.imageUrl,
          videoUrl: diamond.videoUrl,
          certificateUrl: diamond.certificateUrl,
          measurement: diamond.measurements?.length 
            ? `${diamond.measurements.length}x${diamond.measurements.width}x${diamond.measurements.height}`
            : null,
          length: diamond.measurements?.length,
          width: diamond.measurements?.width,
          height: diamond.measurements?.height,
          depth: diamond.measurements?.depth,
          table: diamond.measurements?.table,
          ratio: diamond.measurements?.ratio,
          status: diamond.status,
          // comment field is not part of KyrahDiamond Prisma model; omit or map if added later
          girdle: diamond.additional?.girdle,
          culet: diamond.additional?.culet,
          crownAngle: diamond.additional?.crownAngle,
          crownHeight: diamond.additional?.crownHeight,
          pavilionAngle: diamond.additional?.pavilionAngle,
          pavilionDepth: diamond.additional?.pavilionDepth,
          fancyIntensity: diamond.additional?.fancyIntensity,
          fancyOvertone: diamond.additional?.fancyOvertone,
          fancyColor: diamond.additional?.fancyColor,
          location: diamond.additional?.location,
          inscription: diamond.additional?.inscription,
        })),
      });

      // Update sync record with progress
      await db.kyrahSync.update({
        where: { id: syncRecord.id },
        data: {
          message: `Processing batch ${progress.currentBatch}/${progress.totalBatches} (${i + batch.length}/${allDiamonds.length} diamonds)`,
        },
      });

      // Small delay to prevent overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    progress.status = 'COMPLETED';
    progress.processedDiamonds = allDiamonds.length;

    // Final update
    await db.kyrahSync.update({
      where: { id: syncRecord.id },
      data: {
        status: "COMPLETED",
        diamondsCount: allDiamonds.length,
        message: `Successfully synced ${allDiamonds.length} diamonds in ${progress.totalBatches} batches`,
      },
    });

    console.log(`Batch sync completed successfully. Synced ${allDiamonds.length} diamonds in ${progress.totalBatches} batches.`);
    
    return {
      success: true,
      message: `Successfully synced ${allDiamonds.length} diamonds in ${progress.totalBatches} batches`,
      syncId: syncRecord.id,
      progress,
    };

  } catch (error: unknown) {
    console.error("Error in batch Kyrah sync:", error);
    progress.status = 'FAILED';
    progress.message = error instanceof Error ? error.message : 'Unknown error occurred';

    // Update sync record with error
    if (syncRecord) {
      await db.kyrahSync.update({
        where: { id: syncRecord.id },
        data: {
          status: "FAILED",
          message: progress.message,
        },
      });
    }

    return {
      success: false,
      message: `Failed to sync diamonds: ${progress.message}`,
      error: error instanceof Error ? error : new Error('Unknown error occurred'),
      progress,
    };
  }
}


