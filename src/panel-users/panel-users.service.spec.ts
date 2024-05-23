import { Test, TestingModule } from '@nestjs/testing';
import { PanelUsersService } from './panel-users.service';

describe('PanelUsersService', () => {
  let service: PanelUsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PanelUsersService],
    }).compile();

    service = module.get<PanelUsersService>(PanelUsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
