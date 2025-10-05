/*
  Warnings:

  - You are about to drop the column `facultyId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Faculty` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Faculty" DROP CONSTRAINT "Faculty_universityId_fkey";

-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_facultyId_fkey";

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "facultyId",
ADD COLUMN     "degreeProgramId" TEXT;

-- DropTable
DROP TABLE "public"."Faculty";

-- CreateTable
CREATE TABLE "public"."DegreeProgram" (
    "id" TEXT NOT NULL,
    "universityId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "degree" TEXT,
    "language" TEXT,
    "startSemesters" TEXT,
    "nc" TEXT,

    CONSTRAINT "DegreeProgram_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DegreeProgram_universityId_name_degree_key" ON "public"."DegreeProgram"("universityId", "name", "degree");

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_degreeProgramId_fkey" FOREIGN KEY ("degreeProgramId") REFERENCES "public"."DegreeProgram"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DegreeProgram" ADD CONSTRAINT "DegreeProgram_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "public"."University"("id") ON DELETE CASCADE ON UPDATE CASCADE;
