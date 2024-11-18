import { UUID } from '@app/common/types';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class TransactionRequest {
  @ApiProperty()
  @IsUUID()
  @IsNotEmpty()
  id: UUID;
}
