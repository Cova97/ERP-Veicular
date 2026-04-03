import { Module } from '@nestjs/common';
import { ServicioFrenoService } from './servicio-freno.service';
import { ServicioFrenoController } from './servicio-freno.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServicioFrenoController],
  providers: [ServicioFrenoService],
  exports: [ServicioFrenoService],
})
export class ServicioFrenoModule {}