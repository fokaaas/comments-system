-- CreateEnum
CREATE TYPE "FileType" AS ENUM ('PICTURE', 'TXT');

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "type" "FileType" NOT NULL,
    "comment_id" TEXT NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "files" ADD CONSTRAINT "files_comment_id_fkey" FOREIGN KEY ("comment_id") REFERENCES "comments"("id") ON DELETE CASCADE ON UPDATE CASCADE;
