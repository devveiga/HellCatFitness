-- DropForeignKey
ALTER TABLE `logs` DROP FOREIGN KEY `logs_usuarioId_fkey`;

-- DropIndex
DROP INDEX `logs_usuarioId_fkey` ON `logs`;

-- AlterTable
ALTER TABLE `logs` MODIFY `usuarioId` VARCHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
