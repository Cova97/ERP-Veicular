import { Module } from '@nestjs/common';
import { PropietarioService } from './propietario.service';
import { PropietarioController } from './propietario.controller';
import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PropietarioController],
  providers: [PropietarioService],
  exports: [PropietarioService], // exportado por si Vehiculo lo necesita
})
export class PropietarioModule {}