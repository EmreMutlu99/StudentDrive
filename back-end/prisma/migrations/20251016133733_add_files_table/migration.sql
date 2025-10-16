-- CreateEnum
CREATE TYPE "public"."StorageBackend" AS ENUM ('minio', 's3', 'gcs', 'filesystem');

-- CreateTable
CREATE TABLE "public"."files" (
    "id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "original_filename" TEXT NOT NULL,
    "mimetype" TEXT NOT NULL,
    "size_bytes" INTEGER NOT NULL,
    "storage_path" TEXT NOT NULL,
    "storage_backend" "public"."StorageBackend" NOT NULL DEFAULT 'minio',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_at" TIMESTAMP(3),

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_files_user_id" ON "public"."files"("user_id");

-- CreateIndex
CREATE INDEX "idx_files_created_at" ON "public"."files"("created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_files_user_created" ON "public"."files"("user_id", "created_at" DESC);

-- CreateIndex
CREATE INDEX "idx_files_verified_at" ON "public"."files"("verified_at");

-- AddForeignKey
ALTER TABLE "public"."files" ADD CONSTRAINT "files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
