import cors from 'cors';

// https://blog.logrocket.com/how-to-set-up-node-typescript-express/
import express, { Express } from "express";

import { PlayersController } from './controllers/players.controller';

const app: Express = express();

// Remove powered-by Express header
app.disable('x-powered-by');

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.use('/players', PlayersController);

export { app };
