-- DropForeignKey
ALTER TABLE `treino` DROP FOREIGN KEY `Treino_usuarioId_fkey`;

-- DropIndex
DROP INDEX `Treino_usuarioId_fkey` ON `treino`;

-- AlterTable
ALTER TABLE `treino` MODIFY `usuarioId` VARCHAR(36) NULL;

-- AddForeignKey
ALTER TABLE `Treino` ADD CONSTRAINT `Treino_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
