import { Test, TestingModule } from '@nestjs/testing';
import { ServicioAceiteController } from './servicio-aceite.controller';
import { ServicioAceiteService } from './servicio-aceite.service';

describe('ServicioAceiteController', () => {
  let controller: ServicioAceiteController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicioAceiteController],
      providers: [ServicioAceiteService],
    }).compile();

    controller = module.get<ServicioAceiteController>(ServicioAceiteController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
