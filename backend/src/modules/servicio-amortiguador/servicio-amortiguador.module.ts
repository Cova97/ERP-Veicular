import { Module } from '@nestjs/common';
import { ServicioAmortiguadorService } from './servicio-amortiguador.service';
import { ServicioAmortiguadorController } from './servicio-amortiguador.controller';

@Module({
  controllers: [ServicioAmortiguadorController],
  providers: [ServicioAmortiguadorService],
})
export class ServicioAmortiguadorModule {}
