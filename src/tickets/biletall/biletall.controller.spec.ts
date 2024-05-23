import { Test, TestingModule } from '@nestjs/testing';
import { BiletallController } from './biletall.controller';

describe('BiletallController', () => {
  let controller: BiletallController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BiletallController],
    }).compile();

    controller = module.get<BiletallController>(BiletallController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
