import { Test, TestingModule } from '@nestjs/testing';
import { SubmarcaService } from './submarca.service';

describe('SubmarcaService', () => {
  let service: SubmarcaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubmarcaService],
    }).compile();

    service = module.get<SubmarcaService>(SubmarcaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
