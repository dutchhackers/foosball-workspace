import { Controller, Get } from '@nestjs/common';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';

import { AppService } from './app.service';

class AppVersion {
  @ApiProperty()
  version: string;
}

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @ApiResponse({
    status: 200,
    type: AppVersion,
    description: 'Get App Version',
  })
  getVersion() {
    return <AppVersion>{
      version: '0.1',
    };
  }
}
