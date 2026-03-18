import { Module } from '@nestjs/common';
import { TenenciaService } from './tenencia.service';
import { TenenciaController } from './tenencia.controller';

@Module({
  controllers: [TenenciaController],
  providers: [TenenciaService],
})
export class TenenciaModule {}
