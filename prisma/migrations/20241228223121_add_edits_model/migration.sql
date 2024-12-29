-- CreateTable
CREATE TABLE `Edit` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,
    `newTitle` VARCHAR(191) NULL,
    `newBody` VARCHAR(191) NULL,
    `isApproved` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `approvedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `editableId` INTEGER NOT NULL,
    `editableType` ENUM('Question', 'Answer') NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Edit` ADD CONSTRAINT `edit_question_fkey` FOREIGN KEY (`editableId`) REFERENCES `Question`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Edit` ADD CONSTRAINT `edit_answer_fkey` FOREIGN KEY (`editableId`) REFERENCES `Answer`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
