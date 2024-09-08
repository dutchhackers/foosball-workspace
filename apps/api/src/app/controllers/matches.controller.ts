
import { MatchService } from '@foosball/common';
import express, { Request, Response } from 'express';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  const matchService = new MatchService();
  res.json(await matchService.getMatches());
});

export { router as MatchesController };
