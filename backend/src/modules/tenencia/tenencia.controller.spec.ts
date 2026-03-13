import { Test, TestingModule } from '@nestjs/testing';
import { TenenciaController } from './tenencia.controller';
import { TenenciaService } from './tenencia.service';

describe('TenenciaController', () => {
  let controller: TenenciaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenenciaController],
      providers: [TenenciaService],
    }).compile();

    controller = module.get<TenenciaController>(TenenciaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
