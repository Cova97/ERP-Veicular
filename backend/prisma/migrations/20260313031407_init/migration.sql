-- CreateTable
CREATE TABLE `marcas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `marcas_nombre_key`(`nombre`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `modelos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `marcaId` INTEGER NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `modelos_nombre_marcaId_key`(`nombre`, `marcaId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `submarcas` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(100) NOT NULL,
    `modeloId` INTEGER NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `submarcas_nombre_modeloId_key`(`nombre`, `modeloId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `propietarios` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(150) NOT NULL,
    `apellido` VARCHAR(150) NOT NULL,
    `telefono` VARCHAR(20) NULL,
    `email` VARCHAR(200) NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `propietarios_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `vehiculos` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `numPlaca` VARCHAR(20) NOT NULL,
    `numSerie` VARCHAR(50) NOT NULL,
    `submarcaId` INTEGER NOT NULL,
    `anio` INTEGER NOT NULL,
    `color` VARCHAR(50) NOT NULL,
    `kilometraje` INTEGER NOT NULL DEFAULT 0,
    `propietarioId` INTEGER NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `vehiculos_numPlaca_key`(`numPlaca`),
    UNIQUE INDEX `vehiculos_numSerie_key`(`numSerie`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servicios_aceite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehiculoId` INTEGER NOT NULL,
    `fechaUltimoServicio` DATETIME(3) NOT NULL,
    `kmUltimoServicio` INTEGER NOT NULL,
    `intervaloKm` INTEGER NOT NULL DEFAULT 5000,
    `intervaloMeses` INTEGER NOT NULL DEFAULT 3,
    `proximaFecha` DATETIME(3) NOT NULL,
    `proximoKm` INTEGER NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historial_aceite` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `servicioId` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `kmAlServicio` INTEGER NOT NULL,
    `tipoAceite` VARCHAR(100) NULL,
    `taller` VARCHAR(200) NULL,
    `costo` DECIMAL(10, 2) NULL,
    `notas` TEXT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `verificaciones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehiculoId` INTEGER NOT NULL,
    `fechaUltima` DATETIME(3) NOT NULL,
    `resultado` ENUM('APROBADO', 'RECHAZADO', 'NO_VERIFICADO') NOT NULL DEFAULT 'APROBADO',
    `holograma` VARCHAR(20) NULL,
    `centro` VARCHAR(200) NULL,
    `proximaFecha` DATETIME(3) NOT NULL,
    `intervaloMeses` INTEGER NOT NULL DEFAULT 12,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historial_verificacion` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `verificacionId` INTEGER NOT NULL,
    `fecha` DATETIME(3) NOT NULL,
    `resultado` ENUM('APROBADO', 'RECHAZADO', 'NO_VERIFICADO') NOT NULL,
    `holograma` VARCHAR(20) NULL,
    `centro` VARCHAR(200) NULL,
    `costo` DECIMAL(10, 2) NULL,
    `notas` TEXT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `tenencias` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `vehiculoId` INTEGER NOT NULL,
    `anioFiscal` INTEGER NOT NULL,
    `fechaPago` DATETIME(3) NULL,
    `monto` DECIMAL(10, 2) NULL,
    `folio` VARCHAR(100) NULL,
    `pagado` BOOLEAN NOT NULL DEFAULT false,
    `fechaLimite` DATETIME(3) NOT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `actualizadoEn` DATETIME(3) NOT NULL,

    UNIQUE INDEX `tenencias_vehiculoId_anioFiscal_key`(`vehiculoId`, `anioFiscal`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `historial_tenencia` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tenenciaId` INTEGER NOT NULL,
    `anioFiscal` INTEGER NOT NULL,
    `fechaPago` DATETIME(3) NOT NULL,
    `monto` DECIMAL(10, 2) NOT NULL,
    `folio` VARCHAR(100) NULL,
    `notas` TEXT NULL,
    `creadoEn` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `modelos` ADD CONSTRAINT `modelos_marcaId_fkey` FOREIGN KEY (`marcaId`) REFERENCES `marcas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `submarcas` ADD CONSTRAINT `submarcas_modeloId_fkey` FOREIGN KEY (`modeloId`) REFERENCES `modelos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehiculos` ADD CONSTRAINT `vehiculos_submarcaId_fkey` FOREIGN KEY (`submarcaId`) REFERENCES `submarcas`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `vehiculos` ADD CONSTRAINT `vehiculos_propietarioId_fkey` FOREIGN KEY (`propietarioId`) REFERENCES `propietarios`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `servicios_aceite` ADD CONSTRAINT `servicios_aceite_vehiculoId_fkey` FOREIGN KEY (`vehiculoId`) REFERENCES `vehiculos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_aceite` ADD CONSTRAINT `historial_aceite_servicioId_fkey` FOREIGN KEY (`servicioId`) REFERENCES `servicios_aceite`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `verificaciones` ADD CONSTRAINT `verificaciones_vehiculoId_fkey` FOREIGN KEY (`vehiculoId`) REFERENCES `vehiculos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_verificacion` ADD CONSTRAINT `historial_verificacion_verificacionId_fkey` FOREIGN KEY (`verificacionId`) REFERENCES `verificaciones`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `tenencias` ADD CONSTRAINT `tenencias_vehiculoId_fkey` FOREIGN KEY (`vehiculoId`) REFERENCES `vehiculos`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `historial_tenencia` ADD CONSTRAINT `historial_tenencia_tenenciaId_fkey` FOREIGN KEY (`tenenciaId`) REFERENCES `tenencias`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
