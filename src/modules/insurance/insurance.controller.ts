import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Insurance')
@Controller('insurance')
export class InsuranceController {}
