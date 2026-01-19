-- CreateTable
CREATE TABLE "measurement_log" (
    "measureId" TEXT NOT NULL,
    "voltage" DOUBLE PRECISION NOT NULL,
    "current" DOUBLE PRECISION NOT NULL,
    "power" DOUBLE PRECISION NOT NULL,
    "energy" DOUBLE PRECISION NOT NULL,
    "createdTime" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "measurement_log_pkey" PRIMARY KEY ("measureId")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "measurement_log_measureId_key" ON "measurement_log"("measureId");

-- CreateIndex
CREATE UNIQUE INDEX "User_id_key" ON "User"("id");
