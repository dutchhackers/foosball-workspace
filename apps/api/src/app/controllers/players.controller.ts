// import { PlayerService } from '@foosball/api/common';
// import { IPlayer } from '@foosball/dto';
import express, { Request, Response } from 'express';
import * as logger from 'firebase-functions/logger';

import { PlayerService } from '@foosball/common';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  logger.debug('Get Players', req.params);

  const playerService = new PlayerService();
  const response = await playerService.getPlayers();
  res.json(response);
});

router.get('/:id', async (req: Request, res: Response) => {
  logger.debug('Get Players', req.params);

  //   if (!playerId) {
  //     throw new BadRequestException();
  //   }

  const playerService = new PlayerService();
  const response = await playerService.getPlayer(req.params.id);
  res.json(response);
});

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
