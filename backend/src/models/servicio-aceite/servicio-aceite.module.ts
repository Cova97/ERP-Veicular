import { Module } from '@nestjs/common';
import { ServicioAceiteService } from './servicio-aceite.service';
import { ServicioAceiteController } from './servicio-aceite.controller';

@Module({
  controllers: [ServicioAceiteController],
  providers: [ServicioAceiteService],
})
export class ServicioAceiteModule {}
