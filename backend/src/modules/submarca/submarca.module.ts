import { Module } from '@nestjs/common';
import { SubmarcaService } from './submarca.service';
import { SubmarcaController } from './submarca.controller';

@Module({
  controllers: [SubmarcaController],
  providers: [SubmarcaService],
})
export class SubmarcaModule {}
