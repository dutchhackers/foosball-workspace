// import { PlayerService } from '@foosball/api/common';
// import { IPlayer } from '@foosball/dto';
// import { BadRequestException, Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import * as express from 'express';
// import { CharacterService } from "../../../libs/core/services/character-service";
// import { UserServiceV2 } from "../../../libs/core/services/user-service-v2";

const router = express.Router();

router.get('/', (req, res) => {
// @Get()
// getData() {
//   return this.playerService.getPlayers();
// }


});

// @Controller('players')

// constructor(private playerService: PlayerService) {}


// @Get('/:id')
// async getPlayer(@Param('id') playerId: string) {
//   if (!playerId) {
//     throw new BadRequestException();
//   }
//   return this.playerService.getPlayer(playerId);
// }

// @Post()
// createPlayer(@Body() createPlayerInput: Partial<IPlayer>) {
//   return this.playerService.addPlayer(createPlayerInput);
// }

// @Put()
// updatePlayer(@Param('id') playerId: string, @Body() updatePlayerInput: Partial<IPlayer>) {
//   if (!playerId) {
//     throw new BadRequestException();
//   }
//   return this.playerService.updatePlayer(playerId, updatePlayerInput);
// }

export { router as PlayersController };
