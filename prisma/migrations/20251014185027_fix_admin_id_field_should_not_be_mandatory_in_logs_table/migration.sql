-- DropForeignKey
ALTER TABLE `logs` DROP FOREIGN KEY `logs_adminId_fkey`;

-- DropIndex
DROP INDEX `logs_adminId_fkey` ON `logs`;

-- AlterTable
ALTER TABLE `logs` MODIFY `adminId` VARCHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admins`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
