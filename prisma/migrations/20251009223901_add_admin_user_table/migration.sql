/*
  Warnings:

  - Added the required column `adminId` to the `logs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `logs` ADD COLUMN `adminId` VARCHAR(36) NOT NULL;

-- AlterTable
ALTER TABLE `propostas` ADD COLUMN `adminId` VARCHAR(36) NULL;

-- AlterTable
ALTER TABLE `treino` ADD COLUMN `adminId` VARCHAR(36) NULL;

-- CreateTable
CREATE TABLE `admins` (
    `id` VARCHAR(36) NOT NULL,
    `nome` VARCHAR(60) NOT NULL,
    `email` VARCHAR(40) NOT NULL,
    `senha` VARCHAR(60) NOT NULL,
    `nivel` SMALLINT NOT NULL DEFAULT 2,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Treino` ADD CONSTRAINT `Treino_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admins`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logs` ADD CONSTRAINT `logs_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admins`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `propostas` ADD CONSTRAINT `propostas_adminId_fkey` FOREIGN KEY (`adminId`) REFERENCES `admins`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
