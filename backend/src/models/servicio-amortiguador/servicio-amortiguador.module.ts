import { Module } from '@nestjs/common';
import { ServicioAmortiguadorService } from './servicio-amortiguador.service';
import { ServicioAmortiguadorController } from './servicio-amortiguador.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServicioAmortiguadorController],
  providers: [ServicioAmortiguadorService],
  exports: [ServicioAmortiguadorService],
})
export class ServicioAmortiguadorModule {}