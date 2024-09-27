import { BiletAllApiConfigService } from '@app/configs/bilet-all-api';
import { ConfigModule } from '@app/configs/config.module';
import { BusController } from '@app/modules/tickets/bus/bus.controller';
import { BusCompanyRequestDto } from '@app/modules/tickets/bus/dto/bus-company.dto';
import { BiletAllParser } from '@app/modules/tickets/bus/services/biletall/biletall-bus.parser';
import { BiletAllService } from '@app/modules/tickets/bus/services/biletall/biletall-bus.service';
import { BusService } from '@app/modules/tickets/bus/services/bus.service';
import { Test, TestingModule } from '@nestjs/testing';

describe('BusController', () => {
  const busServiceMock = () => {};

  let controller: BusController;
  let biletAllBusService: BiletAllService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        BiletAllParser,
        BiletAllService,
        BiletAllApiConfigService,
        {
          provide: BusService,
          useFactory: busServiceMock,
        },
      ],
      controllers: [BusController],
    }).compile();
    controller = module.get<BusController>(BusController);
    biletAllBusService = module.get<BiletAllService>(BiletAllService);
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
  });

  describe('company method', () => {
    it('should return expected value', async () => {
      const dto = new BusCompanyRequestDto();
      dto.companyNo = '2';

      jest
        .spyOn(biletAllBusService, 'company')
        // @ts-ignore
        .mockResolvedValueOnce([{ test: '1' }]);

      const res = await controller.company(dto);

      expect(biletAllBusService.company).toBeCalledWith(dto);
      expect(res).toStrictEqual([{ test: '1' }]);
    });
  });
});
