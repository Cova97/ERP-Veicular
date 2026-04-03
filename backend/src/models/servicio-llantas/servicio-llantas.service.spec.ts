import { Test, TestingModule } from '@nestjs/testing';
import { ServicioLlantasService } from './servicio-llantas.service';

describe('ServicioLlantasService', () => {
  let service: ServicioLlantasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicioLlantasService],
    }).compile();

    service = module.get<ServicioLlantasService>(ServicioLlantasService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
