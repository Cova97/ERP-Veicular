import { Module } from '@nestjs/common';
import { PropietarioService } from './propietario.service';
import { PropietarioController } from './propietario.controller';

@Module({
  controllers: [PropietarioController],
  providers: [PropietarioService],
})
export class PropietarioModule {}
