import { Module } from '@nestjs/common';
import { TenenciaService } from './tenencia.service';
import { TenenciaController } from './tenencia.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TenenciaController],
  providers: [TenenciaService],
  exports: [TenenciaService],
})
export class TenenciaModule {}