import { Module } from '@nestjs/common';
import { ModeloService } from './modelo.service';
import { ModeloController } from './modelo.controller';

@Module({
  controllers: [ModeloController],
  providers: [ModeloService],
})
export class ModeloModule {}
