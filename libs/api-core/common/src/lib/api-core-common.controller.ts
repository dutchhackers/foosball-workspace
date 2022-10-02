import { Controller } from '@nestjs/common';
import { ApiCoreCommonService } from './api-core-common.service';

@Controller('api-core-common')
export class ApiCoreCommonController {
  constructor(private apiCoreCommonService: ApiCoreCommonService) {}
}
