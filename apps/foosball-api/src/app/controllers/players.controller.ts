import { PlayerService } from '@foosball/api/common';
import { Controller, Get } from '@nestjs/common';

@Controller('players')
export class PlayersController {
  constructor(private playerService: PlayerService) {}

  @Get()
  getData() {
    return this.playerService.getPlayers();
  }
}
