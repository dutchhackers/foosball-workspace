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
  logger.debug('Get Player', req.params);

  const playerService = new PlayerService();
  const response = await playerService.getPlayer(req.params.id);
  res.json(response);
});

router.post('/', async (req: Request, res: Response) => {
  const playerService = new PlayerService();
  const response = playerService.addPlayer(req.body);
  res.json(response);
});

router.put('/:id', async (req: Request, res: Response) => {
  const playerService = new PlayerService();
  playerService.updatePlayer(req.params.id, req.body);
  res.json();
});

export { router as PlayersController };
