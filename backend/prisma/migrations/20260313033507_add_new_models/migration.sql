/*
  Warnings:

  - You are about to drop the column `resultado` on the `historial_verificacion` table. All the data in the column will be lost.
  - You are about to drop the column `resultado` on the `verificaciones` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `historial_verificacion` DROP COLUMN `resultado`;

-- AlterTable
ALTER TABLE `servicios_aceite` ADD COLUMN `status` ENUM('PENDIENTE', 'A_TIEMPO', 'FINALIZADO') NOT NULL DEFAULT 'A_TIEMPO';

-- AlterTable
ALTER TABLE `tenencias` ADD COLUMN `status` ENUM('PENDIENTE', 'A_TIEMPO', 'FINALIZADO') NOT NULL DEFAULT 'A_TIEMPO';

-- AlterTable
ALTER TABLE `verificaciones` DROP COLUMN `resultado`,
    ADD COLUMN `status` ENUM('PENDIENTE', 'A_TIEMPO', 'FINALIZADO') NOT NULL DEFAULT 'A_TIEMPO';

-- CreateTable
CREATE TABLE `servicios_llantas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehiculoId` INTEGER NOT NULL,
    `status` ENUM('PENDIENTE', 'A_TIEMPO', 'FINALIZADO') NOT NULL DEFAULT 'A_TIEMPO',
    `kmUltimoServicio` INTEGER NOT NULL,
    `intervaloKm` INTEGER NOT NULL DEFAULT 40000,
    `proximoKm` INTEGER NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historial_llantas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `servicioId` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `kmAlServicio` INTEGER NOT NULL,
    `tipoServicio` VARCHAR(100) NULL,
    `marcaLlanta` VARCHAR(100) NULL,
    `taller` VARCHAR(200) NULL,
    `costo` DECIMAL(10, 2) NULL,
    `notas` TEXT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicios_amortiguador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehiculoId` INTEGER NOT NULL,
    `status` ENUM('PENDIENTE', 'A_TIEMPO', 'FINALIZADO') NOT NULL DEFAULT 'A_TIEMPO',
    `kmUltimoServicio` INTEGER NOT NULL,
    `intervaloKm` INTEGER NOT NULL DEFAULT 80000,
    `proximoKm` INTEGER NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historial_amortiguador` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `servicioId` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `kmAlServicio` INTEGER NOT NULL,
    `tipoServicio` VARCHAR(100) NULL,
    `marca` VARCHAR(100) NULL,
    `taller` VARCHAR(200) NULL,
    `costo` DECIMAL(10, 2) NULL,
    `notas` TEXT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicios_freno` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehiculoId` INTEGER NOT NULL,
    `status` ENUM('PENDIENTE', 'A_TIEMPO', 'FINALIZADO') NOT NULL DEFAULT 'A_TIEMPO',
    `kmUltimoServicio` INTEGER NOT NULL,
    `intervaloKm` INTEGER NOT NULL DEFAULT 30000,
    `proximoKm` INTEGER NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historial_freno` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `servicioId` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `kmAlServicio` INTEGER NOT NULL,
    `tipoServicio` VARCHAR(100) NULL,
    `taller` VARCHAR(200) NULL,
    `costo` DECIMAL(10, 2) NULL,
    `notas` TEXT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `servicios_llantas` ADD CONSTRAINT `servicios_llantas_vehiculoId_fkey` FOREIGN KEY (`vehiculoId`) REFERENCES `vehiculos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_llantas` ADD CONSTRAINT `historial_llantas_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `servicios_llantas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicios_amortiguador` ADD CONSTRAINT `servicios_amortiguador_vehiculoId_fkey` FOREIGN KEY (`vehiculoId`) REFERENCES `vehiculos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_amortiguador` ADD CONSTRAINT `historial_amortiguador_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `servicios_amortiguador`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicios_freno` ADD CONSTRAINT `servicios_freno_vehiculoId_fkey` FOREIGN KEY (`vehiculoId`) REFERENCES `vehiculos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_freno` ADD CONSTRAINT `historial_freno_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `servicios_freno`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
