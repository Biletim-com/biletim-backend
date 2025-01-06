import { ApiProperty } from '@nestjs/swagger';

export class ListResponseDto<T> {
  @ApiProperty({ description: 'Data to be returned', example: '0' })
  data: T[];

  @ApiProperty({ description: 'Number of records' })
  count: number;
}
