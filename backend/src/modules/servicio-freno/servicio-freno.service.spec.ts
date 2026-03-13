import { Test, TestingModule } from '@nestjs/testing';
import { ServicioFrenoService } from './servicio-freno.service';

describe('ServicioFrenoService', () => {
  let service: ServicioFrenoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicioFrenoService],
    }).compile();

    service = module.get<ServicioFrenoService>(ServicioFrenoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
