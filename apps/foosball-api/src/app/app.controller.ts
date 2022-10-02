import { Controller, Get } from '@nestjs/common';
import { ApiProperty, ApiResponse } from '@nestjs/swagger';

class AppVersion {
  @ApiProperty()
  version: string;
}

@Controller()
export class AppController {
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
