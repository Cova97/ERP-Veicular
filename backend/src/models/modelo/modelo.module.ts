import { Module } from '@nestjs/common';
import { ModeloService } from './modelo.service';
import { ModeloController } from './modelo.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ModeloController],
  providers: [ModeloService],
  exports: [ModeloService], // exportado por si Submarca lo necesita
})
export class ModeloModule {}