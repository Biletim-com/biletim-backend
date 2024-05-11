import { Test, TestingModule } from '@nestjs/testing';
import { BiletallService } from './biletall.service';

describe('BiletallService', () => {
  let service: BiletallService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BiletallService],
    }).compile();

    service = module.get<BiletallService>(BiletallService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
