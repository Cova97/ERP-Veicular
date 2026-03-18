import { Module } from '@nestjs/common';
import { ServicioFrenoService } from './servicio-freno.service';
import { ServicioFrenoController } from './servicio-freno.controller';

@Module({
  controllers: [ServicioFrenoController],
  providers: [ServicioFrenoService],
})
export class ServicioFrenoModule {}
