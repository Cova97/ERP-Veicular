import { Module } from '@nestjs/common';
import { VerificacionService } from './verificacion.service';
import { VerificacionController } from './verificacion.controller';

@Module({
  controllers: [VerificacionController],
  providers: [VerificacionService],
})
export class VerificacionModule {}
