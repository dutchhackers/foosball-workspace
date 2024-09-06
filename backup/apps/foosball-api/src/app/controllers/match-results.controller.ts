import { MatchService } from '@foosball/api/common';
import { BadRequestException, Body, Controller, Get, Post, Query } from '@nestjs/common';

@Controller('match-results')
export class MatchResultsController {
  constructor(private matchService: MatchService) {}

  @Get()
  async getMatches(@Query() query) {
    const defaultOpts = { limit: 5 };
    if (query && query.limit) {
      defaultOpts.limit = parseInt(query.limit);
    }

    try {
      const response: any = await this.matchService.getMatches(defaultOpts);
      return response;
    } catch {
      throw new BadRequestException();
    }
  }

  // Easiest way to report a new match result
  @Post()
  async postMatchResult(@Body() body) {
    const requestData: any = body;
    const matchDataOpts: any = {};

    if (!requestData.homeTeamIds || !requestData.awayTeamIds) {
      throw new BadRequestException();
    }

    if (requestData.matchDate) {
      matchDataOpts.matchDate = requestData.matchDate;
    }

    try {
      const response: any = await this.matchService.addSimpleMatchResult(
        requestData.homeTeamIds,
        requestData.awayTeamIds,
        requestData.finalScore,
        matchDataOpts
      );
      return response;
    } catch (e) {
      console.log(e);
      throw new BadRequestException();
    }
  }
}
