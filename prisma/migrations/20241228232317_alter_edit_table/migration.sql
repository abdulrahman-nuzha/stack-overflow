/*
  Warnings:

  - You are about to drop the column `editableId` on the `edit` table. All the data in the column will be lost.
  - You are about to drop the column `editableType` on the `edit` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `edit` DROP FOREIGN KEY `edit_answer_fkey`;

-- DropForeignKey
ALTER TABLE `edit` DROP FOREIGN KEY `edit_question_fkey`;

-- DropIndex
DROP INDEX `edit_answer_fkey` ON `edit`;

-- AlterTable
ALTER TABLE `edit` DROP COLUMN `editableId`,
    DROP COLUMN `editableType`,
    ADD COLUMN `answerId` INTEGER NULL,
    ADD COLUMN `questionId` INTEGER NULL;

-- AddForeignKey
ALTER TABLE `Edit` ADD CONSTRAINT `Edit_questionId_fkey` FOREIGN KEY (`questionId`) REFERENCES `Question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Edit` ADD CONSTRAINT `Edit_answerId_fkey` FOREIGN KEY (`answerId`) REFERENCES `Answer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
