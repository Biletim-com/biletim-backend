-- DropForeignKey
ALTER TABLE "Verification" DROP CONSTRAINT "Verification_user_id_fkey";

-- AddForeignKey
ALTER TABLE "Verification" ADD CONSTRAINT "Verification_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
