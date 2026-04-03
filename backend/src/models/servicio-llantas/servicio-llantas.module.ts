import { Module } from '@nestjs/common';
import { ServicioLlantasService } from './servicio-llantas.service';
import { ServicioLlantasController } from './servicio-llantas.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServicioLlantasController],
  providers: [ServicioLlantasService],
  exports: [ServicioLlantasService],
})
export class ServicioLlantasModule {}