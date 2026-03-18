import { Test, TestingModule } from '@nestjs/testing';
import { ServicioLlantasController } from './servicio-llantas.controller';
import { ServicioLlantasService } from './servicio-llantas.service';

describe('ServicioLlantasController', () => {
  let controller: ServicioLlantasController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicioLlantasController],
      providers: [ServicioLlantasService],
    }).compile();

    controller = module.get<ServicioLlantasController>(ServicioLlantasController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
