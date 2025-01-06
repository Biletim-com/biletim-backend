import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumberString } from 'class-validator';

const PER_PAGE = 10;

export class PaginationDto {
  @ApiProperty({ description: 'Number of records per page', example: 10 })
  @IsOptional()
  @IsNumberString()
  private perPage?: Nullable<string>;

  @ApiProperty({ description: 'Page number', example: 1 })
  @IsOptional()
  @IsNumberString()
  private page?: Nullable<string>;

  get take(): number {
    if (this.perPage) {
      const perPageNumber = parseInt(this.perPage);
      return perPageNumber <= 0 ? 0 : perPageNumber;
    }
    return PER_PAGE;
  }

  get skip(): number {
    if (this.page) {
      const pageNumber = parseInt(this.page);
      return (pageNumber <= 0 ? 0 : pageNumber - 1) * this.take;
    }
    return 0;
  }
}
