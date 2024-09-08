import { DataMartService } from '@foosball/api/common';
import { BadRequestException, Controller, Get, Query } from '@nestjs/common';

@Controller('data')
export class DataController {
  constructor(private dataMartService: DataMartService) {}

  @Get('/matches')
  async getMatchesData(@Query() query) {
    const defaultOpts = { limit: 100 };
    if (query && query.limit) {
      defaultOpts.limit = parseInt(query.limit);
    }

    try {
      const response: any = await this.dataMartService.getCubeData('matches', defaultOpts);
      return response;
    } catch {
      throw new BadRequestException();
    }
  }

  @Get('/matches-by-player')
  async getMatchesByPlayerData(@Query() query) {
    const defaultOpts = { limit: 100 };
    if (query && query.limit) {
      defaultOpts.limit = parseInt(query.limit);
    }

    try {
      const response: any = await this.dataMartService.getCubeData('matches-by-player', defaultOpts);
      return response;
    } catch {
      throw new BadRequestException();
    }
  }
}
