import { Test, TestingModule } from '@nestjs/testing';
import { BiletAllService } from './biletall.service';

describe('BiletallService', () => {
  let service: BiletAllService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BiletAllService],
    }).compile();

    service = module.get<BiletAllService>(BiletAllService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
