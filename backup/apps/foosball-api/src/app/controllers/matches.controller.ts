import { MatchService } from '@foosball/api/common';
import { Controller, Get } from '@nestjs/common';

@Controller('matches')
export class MatchesController {
  constructor(private matchService: MatchService) {}

  @Get()
  getData() {
    return this.matchService.getMatches();
  }
}
