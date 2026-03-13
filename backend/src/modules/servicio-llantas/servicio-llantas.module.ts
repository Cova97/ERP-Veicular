import { Module } from '@nestjs/common';
import { ServicioLlantasService } from './servicio-llantas.service';
import { ServicioLlantasController } from './servicio-llantas.controller';

@Module({
  controllers: [ServicioLlantasController],
  providers: [ServicioLlantasService],
})
export class ServicioLlantasModule {}
