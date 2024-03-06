-- CreateTable
CREATE TABLE "Defense" (
    "id" SERIAL NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "locationId" INTEGER NOT NULL,
    "tfgId" INTEGER,

    CONSTRAINT "Defense_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "mapLink" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Defense_tfgId_key" ON "Defense"("tfgId");

-- AddForeignKey
ALTER TABLE "Defense" ADD CONSTRAINT "Defense_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Defense" ADD CONSTRAINT "Defense_tfgId_fkey" FOREIGN KEY ("tfgId") REFERENCES "TFG"("id") ON DELETE SET NULL ON UPDATE CASCADE;
