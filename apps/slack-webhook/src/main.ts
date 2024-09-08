import * as logger from 'firebase-functions/logger';
import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2/options';

const DEFAULT_REGION = 'europe-west1';

// locate all functions closest to users
setGlobalOptions({ region: DEFAULT_REGION });

export const slackHook = onRequest((request, response) => {
  logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Firebase!');
});
