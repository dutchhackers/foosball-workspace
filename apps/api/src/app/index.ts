import cors from 'cors';

// https://blog.logrocket.com/how-to-set-up-node-typescript-express/
import express, { Express } from 'express';

import './config';

import { PlayersController } from './controllers/players.controller';
import { MatchResultsController } from './controllers/match-results.controller';
import { MatchesController } from './controllers/matches.controller';
import { GeminiController } from './controllers/gemini.controller';

const app: Express = express();

// Remove powered-by Express header
app.disable('x-powered-by');

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.use('/players', PlayersController);
app.use('/matches', MatchesController);
app.use('/match-results', MatchResultsController);
app.use('/gemini', GeminiController);

export { app };
