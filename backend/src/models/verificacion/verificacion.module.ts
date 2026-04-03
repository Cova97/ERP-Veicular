import { Module } from '@nestjs/common';
import { VerificacionService } from './verificacion.service';
import { VerificacionController } from './verificacion.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [VerificacionController],
  providers: [VerificacionService],
  exports: [VerificacionService],
})
export class VerificacionModule {}