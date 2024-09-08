import express, { Request, Response } from 'express';
import * as logger from 'firebase-functions/logger';

import { MatchService } from '@foosball/common';

const router = express.Router();

router.get('/', async (req: Request, res: Response) => {
  logger.debug('Get Match-Results', req.params);

  const matchService = new MatchService();

  const defaultOpts = { limit: 5 };
  // if (query && query.limit) {
  //   defaultOpts.limit = parseInt(query.limit);
  // }

  const response = await matchService.getMatches(defaultOpts);
  res.json(response);
});

router.post('/', async (req: Request, res: Response) => {
  const matchService = new MatchService();
  const requestData: any = req.body;
  const matchDataOpts: any = {};

  if (!requestData.homeTeamIds || !requestData.awayTeamIds) {
    throw new Error(); //BadRequestException();
  }

  if (requestData.matchDate) {
    matchDataOpts.matchDate = requestData.matchDate;
  }

  try {
    const response: any = await matchService.addSimpleMatchResult(
      requestData.homeTeamIds,
      requestData.awayTeamIds,
      requestData.finalScore,
      matchDataOpts
    );
    res.json(response);
  } catch (e) {
    console.log(e);
    throw new Error(); //BadRequestException();
  }
});

export { router as MatchResultsController };
