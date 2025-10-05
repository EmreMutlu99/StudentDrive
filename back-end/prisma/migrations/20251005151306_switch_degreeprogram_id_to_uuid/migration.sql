/*
  Warnings:

  - Made the column `degree` on table `DegreeProgram` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."DegreeProgram" ALTER COLUMN "degree" SET NOT NULL;
