import { AuthGuard } from '@foosball/api/auth';
import { PlayerService } from '@foosball/api/common';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('players')
export class PlayersController {
  constructor(private playerService: PlayerService) {}

  @UseGuards(AuthGuard)
  @Get()
  getData() {
    return this.playerService.getPlayers();
  }
}
