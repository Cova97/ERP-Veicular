import { Test, TestingModule } from '@nestjs/testing';
import { TenenciaService } from './tenencia.service';

describe('TenenciaService', () => {
  let service: TenenciaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenenciaService],
    }).compile();

    service = module.get<TenenciaService>(TenenciaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
