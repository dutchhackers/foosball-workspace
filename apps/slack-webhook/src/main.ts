import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2/options';
import './config';

const DEFAULT_REGION = 'europe-west1';

import { connectFirestore } from '@foosball/common';
connectFirestore();

import { app } from './app';

// locate all functions closest to users
setGlobalOptions({ region: DEFAULT_REGION });

// Export triggers
export { onNewMatch } from './triggers/match.trigger';

/**
 * HTTP trigger
 * */
export const slackWebhook = onRequest({ memory: '2GiB', timeoutSeconds: 120 }, app);

logger.info('Slack Webhook function initialized');
