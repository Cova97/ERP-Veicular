import { Test, TestingModule } from '@nestjs/testing';
import { ServicioAmortiguadorService } from './servicio-amortiguador.service';

describe('ServicioAmortiguadorService', () => {
  let service: ServicioAmortiguadorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicioAmortiguadorService],
    }).compile();

    service = module.get<ServicioAmortiguadorService>(ServicioAmortiguadorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
