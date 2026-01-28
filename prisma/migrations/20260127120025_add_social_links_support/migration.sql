-- AlterTable
ALTER TABLE "Link" ADD COLUMN     "icon" TEXT,
ADD COLUMN     "type" TEXT;

-- CreateIndex
CREATE INDEX "Link_type_idx" ON "Link"("type");
