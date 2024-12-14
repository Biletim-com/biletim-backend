import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

// service
import { BiletAllOfficialHolidaysService } from '@app/providers/ticket/biletall/common/services/biletall-official-holidays.service';
import { BiletAllTravelCountryCodeService } from '@app/providers/ticket/biletall/common/services/biletall-travel-country-code.service';

// dto request
import { OfficialHolidaysRequestDto } from './dto/get-official-holidays.dto';

// dto response
import { CountryDto } from '@app/providers/ticket/biletall/common/dto/travel-country-code.dto';
import { OfficialHolidaysDto } from '@app/providers/ticket/biletall/common/dto/get-official-holidays.dto';

@ApiTags('Search')
@Controller('search')
export class SearchGeneralController {
  constructor(
    private readonly biletAllOfficialHolidaysService: BiletAllOfficialHolidaysService,
    private readonly biletAllTravelCountryCodeService: BiletAllTravelCountryCodeService,
  ) {}

  @Get('official-holidays')
  @ApiOperation({ summary: 'Get official holidays for a given year' })
  async getOfficialHolidays(
    @Query() requestDto: OfficialHolidaysRequestDto,
  ): Promise<OfficialHolidaysDto[]> {
    return this.biletAllOfficialHolidaysService.getOfficialHolidays(requestDto);
  }

  @Get('country-codes')
  @ApiOperation({
    summary:
      'Get travel country code to fill in the passport code at payments ',
  })
  async getTravelCountryCode(): Promise<CountryDto[]> {
    return this.biletAllTravelCountryCodeService.getTravelCountryCode();
  }
}
