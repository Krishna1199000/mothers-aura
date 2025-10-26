-- CreateTable
CREATE TABLE "KyrahDiamond" (
    "id" TEXT NOT NULL,
    "stockId" TEXT NOT NULL,
    "shape" TEXT NOT NULL,
    "carat" DOUBLE PRECISION NOT NULL,
    "color" TEXT NOT NULL,
    "clarity" TEXT NOT NULL,
    "cut" TEXT,
    "polish" TEXT NOT NULL,
    "symmetry" TEXT NOT NULL,
    "certificateNo" TEXT,
    "lab" TEXT NOT NULL,
    "pricePerCarat" DOUBLE PRECISION NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "imageUrl" TEXT,
    "videoUrl" TEXT,
    "certificateUrl" TEXT,
    "measurement" TEXT,
    "length" DOUBLE PRECISION,
    "width" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "depth" DOUBLE PRECISION,
    "table" DOUBLE PRECISION,
    "ratio" DOUBLE PRECISION,
    "status" TEXT NOT NULL,
    "comment" TEXT,
    "girdle" TEXT,
    "culet" TEXT,
    "crownAngle" DOUBLE PRECISION,
    "crownHeight" TEXT,
    "pavilionAngle" DOUBLE PRECISION,
    "pavilionDepth" DOUBLE PRECISION,
    "fancyIntensity" TEXT,
    "fancyOvertone" TEXT,
    "fancyColor" TEXT,
    "location" TEXT,
    "inscription" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "KyrahDiamond_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "KyrahSync" (
    "id" TEXT NOT NULL,
    "lastSyncAt" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL,
    "message" TEXT,
    "diamondsCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "KyrahSync_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "KyrahDiamond_stockId_key" ON "KyrahDiamond"("stockId");














