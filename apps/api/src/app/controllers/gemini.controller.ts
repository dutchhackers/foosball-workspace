import { GeminiHelper } from '@foosball/common';
import express, { Request, Response } from 'express';

const router = express.Router();

router.post('/shout', async (req: Request, res: Response) => {
  //
  const geminiHelper = new GeminiHelper();
  const response = await geminiHelper.generateMatchResultShout(req.body?.text);
  res.send({ output: response });
});

export { router as GeminiController };
