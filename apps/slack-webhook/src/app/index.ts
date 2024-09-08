import cors from 'cors';
import express, { Express } from 'express';

import { WebhookController } from './controllers/webhook.controller';

const app: Express = express();

// Remove powered-by Express header
app.disable('x-powered-by');

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));

app.use('', WebhookController);

export { app };
