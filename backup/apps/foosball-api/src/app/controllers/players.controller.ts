import { PlayerService } from '@foosball/api/common';
import { IPlayer } from '@foosball/dto';
import { BadRequestException, Body, Controller, Get, Param, Post, Put } from '@nestjs/common';

@Controller('players')
export class PlayersController {
  constructor(private playerService: PlayerService) {}

  @Get()
  getData() {
    return this.playerService.getPlayers();
  }

  @Get('/:id')
  async getPlayer(@Param('id') playerId: string) {
    if (!playerId) {
      throw new BadRequestException();
    }
    return this.playerService.getPlayer(playerId);
  }

  @Post()
  createPlayer(@Body() createPlayerInput: Partial<IPlayer>) {
    return this.playerService.addPlayer(createPlayerInput);
  }

  @Put()
  updatePlayer(@Param('id') playerId: string, @Body() updatePlayerInput: Partial<IPlayer>) {
    if (!playerId) {
      throw new BadRequestException();
    }
    return this.playerService.updatePlayer(playerId, updatePlayerInput);
  }
}
