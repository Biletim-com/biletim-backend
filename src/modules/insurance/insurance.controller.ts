import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Travel-Health-Insurance')
@Controller('insurance')
export class InsuranceController {}
