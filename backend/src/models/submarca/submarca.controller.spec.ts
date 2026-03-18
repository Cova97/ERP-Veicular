import { Test, TestingModule } from '@nestjs/testing';
import { SubmarcaController } from './submarca.controller';
import { SubmarcaService } from './submarca.service';

describe('SubmarcaController', () => {
  let controller: SubmarcaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubmarcaController],
      providers: [SubmarcaService],
    }).compile();

    controller = module.get<SubmarcaController>(SubmarcaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
