/*
  Warnings:

  - Added the required column `page` to the `Column` table without a default value. This is not possible if the table is not empty.
  - Added the required column `page` to the `Todo` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Column" ADD COLUMN     "page" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Todo" ADD COLUMN     "page" TEXT NOT NULL;
