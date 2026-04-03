import { Test, TestingModule } from '@nestjs/testing';
import { ServicioFrenoController } from './servicio-freno.controller';
import { ServicioFrenoService } from './servicio-freno.service';

describe('ServicioFrenoController', () => {
  let controller: ServicioFrenoController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicioFrenoController],
      providers: [ServicioFrenoService],
    }).compile();

    controller = module.get<ServicioFrenoController>(ServicioFrenoController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
