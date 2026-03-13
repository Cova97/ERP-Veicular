import { Test, TestingModule } from '@nestjs/testing';
import { ModeloController } from './modelo.controller';
import { ModeloService } from './modelo.service';

describe('ModeloController', () => {
  let controller: ModeloController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ModeloController],
      providers: [ModeloService],
    }).compile();

    controller = module.get<ModeloController>(ModeloController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
