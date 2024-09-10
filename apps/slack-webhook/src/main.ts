import * as logger from 'firebase-functions/logger';

import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2/options';

const DEFAULT_REGION = 'europe-west1';

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
import { connectFirestore } from '@foosball/common';
connectFirestore();

// REST API
import { app } from './app';

// locate all functions closest to users
setGlobalOptions({ region: DEFAULT_REGION });

/**
 * HTTP trigger
 * */
export const slackWebhook = onRequest({ memory: '2GiB', timeoutSeconds: 120 }, app);

logger.info('Slack Webhook function initialized');
