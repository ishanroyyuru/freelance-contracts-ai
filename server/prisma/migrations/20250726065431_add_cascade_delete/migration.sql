/*
  Warnings:

  - You are about to drop the column `tsv` on the `Contract` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Annotation" DROP CONSTRAINT "Annotation_contractId_fkey";

-- DropForeignKey
ALTER TABLE "Summary" DROP CONSTRAINT "Summary_contractId_fkey";

-- DropIndex
DROP INDEX "idx_contracts_tsv";

-- AlterTable
ALTER TABLE "Contract" DROP COLUMN "tsv";

-- AddForeignKey
ALTER TABLE "Annotation" ADD CONSTRAINT "Annotation_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Summary" ADD CONSTRAINT "Summary_contractId_fkey" FOREIGN KEY ("contractId") REFERENCES "Contract"("id") ON DELETE CASCADE ON UPDATE CASCADE;
