import { Controller, Get } from '@nestjs/common';
import { MatchService } from '../services/match.service';

@Controller('matches')
export class MatchesController {
  constructor(private matchService: MatchService) {}

  @Get()
  getData() {
    return this.matchService.test();
  }
}
