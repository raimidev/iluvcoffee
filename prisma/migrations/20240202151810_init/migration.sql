/*
  Warnings:

  - You are about to drop the column `flavors` on the `coffees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "coffees" DROP COLUMN "flavors";

-- CreateTable
CREATE TABLE "flavors" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flavors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CoffeeToFlavor" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CoffeeToFlavor_AB_unique" ON "_CoffeeToFlavor"("A", "B");

-- CreateIndex
CREATE INDEX "_CoffeeToFlavor_B_index" ON "_CoffeeToFlavor"("B");

-- AddForeignKey
ALTER TABLE "_CoffeeToFlavor" ADD CONSTRAINT "_CoffeeToFlavor_A_fkey" FOREIGN KEY ("A") REFERENCES "coffees"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CoffeeToFlavor" ADD CONSTRAINT "_CoffeeToFlavor_B_fkey" FOREIGN KEY ("B") REFERENCES "flavors"("id") ON DELETE CASCADE ON UPDATE CASCADE;
