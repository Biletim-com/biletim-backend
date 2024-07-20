import { Test, TestingModule } from '@nestjs/testing';
import { BiletAllController } from './biletall.controller';

describe('BiletallController', () => {
  let controller: BiletAllController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BiletAllController],
    }).compile();

    controller = module.get<BiletAllController>(BiletAllController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
