import { Test, TestingModule } from '@nestjs/testing';
import { ServicioAceiteService } from './servicio-aceite.service';

describe('ServicioAceiteService', () => {
  let service: ServicioAceiteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ServicioAceiteService],
    }).compile();

    service = module.get<ServicioAceiteService>(ServicioAceiteService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
