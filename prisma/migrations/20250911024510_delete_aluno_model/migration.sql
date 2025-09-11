/*
  Warnings:

  - You are about to drop the column `alunoId` on the `treino` table. All the data in the column will be lost.
  - You are about to drop the `alunos` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[email]` on the table `Instrutor` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Instrutor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `usuarioId` to the `Treino` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `alunos` DROP FOREIGN KEY `alunos_instrutorId_fkey`;

-- DropForeignKey
ALTER TABLE `alunos` DROP FOREIGN KEY `alunos_usuarioId_fkey`;

-- DropForeignKey
ALTER TABLE `treino` DROP FOREIGN KEY `Treino_alunoId_fkey`;

-- DropIndex
DROP INDEX `Treino_alunoId_fkey` ON `treino`;

-- AlterTable
ALTER TABLE `instrutor` ADD COLUMN `email` VARCHAR(100) NOT NULL;

-- AlterTable
ALTER TABLE `treino` DROP COLUMN `alunoId`,
    ADD COLUMN `usuarioId` VARCHAR(36) NOT NULL;

-- DropTable
DROP TABLE `alunos`;

-- CreateIndex
CREATE UNIQUE INDEX `Instrutor_email_key` ON `Instrutor`(`email`);

-- AddForeignKey
ALTER TABLE `Treino` ADD CONSTRAINT `Treino_usuarioId_fkey` FOREIGN KEY (`usuarioId`) REFERENCES `usuarios`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
