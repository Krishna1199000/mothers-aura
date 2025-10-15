import db from "@/lib/prisma";
import { fetchKyrahDiamonds } from "./diamonds";

import { PrismaClient } from "@prisma/client";

export async function syncKyrahDiamonds() {
  let syncRecordId: string | null = null;
  try {
    console.log("Starting Kyrah sync...");
    
    // Create a new sync record
    const syncRecord = await db.kyrahSync.create({
      data: {
        lastSyncAt: new Date(),
        status: "IN_PROGRESS",
      },
    });

    console.log("Created sync record:", syncRecord.id);
    syncRecordId = syncRecord.id;

    // Fetch diamonds from Kyrah API
    console.log("Fetching diamonds from Kyrah API...");
    const diamonds = await fetchKyrahDiamonds();
    console.log(`Fetched ${diamonds.length} diamonds from API`);

    // Begin transaction
    await db.$transaction(async (tx: PrismaClient) => {
      console.log("Starting database transaction...");
      
      // Delete all existing Kyrah diamonds
      console.log("Deleting existing Kyrah diamonds...");
      await tx.kyrahDiamond.deleteMany({});

      // Insert new diamonds
      console.log("Inserting new diamonds...");
      await tx.kyrahDiamond.createMany({
        data: diamonds.map(diamond => ({
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

      // Update sync record
      console.log("Updating sync record...");
      await tx.kyrahSync.update({
        where: { id: syncRecordId! },
        data: {
          status: "COMPLETED",
          diamondsCount: diamonds.length,
        },
      });
      
      console.log("Transaction completed successfully");
    });

    console.log(`Sync completed successfully. Synced ${diamonds.length} diamonds.`);
    return {
      success: true,
      message: `Successfully synced ${diamonds.length} diamonds`,
      syncId: syncRecordId,
    };
    } catch (error: unknown) {
    console.error("Error syncing Kyrah diamonds:", error);

    // Update sync record with error
    if (syncRecordId) {
      await db.kyrahSync.update({
        where: { id: syncRecordId },
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
      syncId: syncRecordId,
    };
  }
}
