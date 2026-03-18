import { Test, TestingModule } from '@nestjs/testing';
import { ServicioAmortiguadorController } from './servicio-amortiguador.controller';
import { ServicioAmortiguadorService } from './servicio-amortiguador.service';

describe('ServicioAmortiguadorController', () => {
  let controller: ServicioAmortiguadorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicioAmortiguadorController],
      providers: [ServicioAmortiguadorService],
    }).compile();

    controller = module.get<ServicioAmortiguadorController>(ServicioAmortiguadorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
