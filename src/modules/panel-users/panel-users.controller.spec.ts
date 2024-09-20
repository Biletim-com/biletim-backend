import { Test, TestingModule } from '@nestjs/testing';
import { PanelUsersController } from './panel-users.controller';
import { PanelUsersService } from './panel-users.service';

describe('PanelUsersController', () => {
  let controller: PanelUsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PanelUsersController],
      providers: [PanelUsersService],
    }).compile();

    controller = module.get<PanelUsersController>(PanelUsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
