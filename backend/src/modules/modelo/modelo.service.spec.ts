import { Test, TestingModule } from '@nestjs/testing';
import { ModeloService } from './modelo.service';

describe('ModeloService', () => {
  let service: ModeloService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ModeloService],
    }).compile();

    service = module.get<ModeloService>(ModeloService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
