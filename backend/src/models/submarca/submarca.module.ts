import { Module } from '@nestjs/common';
import { SubmarcaService } from './submarca.service';
import { SubmarcaController } from './submarca.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SubmarcaController],
  providers: [SubmarcaService],
  exports: [SubmarcaService], // exportado por si Vehiculo lo necesita
})
export class SubmarcaModule {}