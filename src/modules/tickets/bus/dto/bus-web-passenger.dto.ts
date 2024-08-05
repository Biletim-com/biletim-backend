import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class BusWebPassengerDto {
  @IsString()
  @IsOptional()
  webMemberNo?: string;

  @IsNotEmpty()
  @IsString()
  ip: string;

  @IsString()
  @IsOptional()
  @Matches(
    /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/,
    {
      message:
        'Email must match the pattern ^([w-.]+)@(([[0-9]{1,3}.[0-9]{1,3}.[0-9]{1,3}.)|(([w-]+.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(]?)$',
    },
  )
  email?: string;

  @IsOptional()
  @IsString()
  creditCardNo?: string;

  @IsOptional()
  @IsString()
  creditCardHolder?: string;

  @IsOptional()
  @IsString()
  @Matches(/^(0[1-9]|1[0-2])\.\d{4}$/, {
    message: 'Card expiry date must be in the format MM.YYYY',
  })
  creditCardExpiryDate?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\d{3}$/, { message: 'Card CCV2 number must be 3 digits' })
  creditCardCCV2?: string;

  @IsOptional()
  @IsString()
  prepaymentUsage?: string;

  @IsOptional()
  @IsString()
  prepaymentAmount?: string;

  @IsOptional()
  @IsString()
  openTicketPnrNo?: string;

  @IsOptional()
  @IsString()
  openTicketLastName?: string;

  @IsOptional()
  @IsString()
  openTicketAmount?: string;

  @IsOptional()
  @IsString()
  expeditionCode?: string;

  constructor(partial: Partial<BusWebPassengerDto>) {
    Object.assign(this, partial);
    this.webMemberNo = this.webMemberNo ?? '0';
  }
}
