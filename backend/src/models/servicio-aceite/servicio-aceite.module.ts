import { Module } from '@nestjs/common';
import { ServicioAceiteService } from './servicio-aceite.service';
import { ServicioAceiteController } from './servicio-aceite.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServicioAceiteController],
  providers: [ServicioAceiteService],
  exports: [ServicioAceiteService],
})
export class ServicioAceiteModule {}