import { Module } from '@nestjs/common';
import { ApiCoreCommonController } from './api-core-common.controller';
import { ApiCoreCommonService } from './api-core-common.service';

@Module({
  controllers: [ApiCoreCommonController],
  providers: [ApiCoreCommonService],
  exports: [ApiCoreCommonService],
})
export class ApiCoreCommonModule {}
