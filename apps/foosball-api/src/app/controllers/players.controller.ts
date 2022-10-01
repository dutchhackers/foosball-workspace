import { Controller, Get } from '@nestjs/common';
import { PlayerService } from '../services/player.service';

@Controller('players')
export class PlayersController {
  constructor(private playerService: PlayerService) {}

  @Get()
  getData() {
    return this.playerService.test();
  }
}
