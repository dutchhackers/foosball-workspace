/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2/options';
// import * as logger from 'firebase-functions/logger';

const DEFAULT_REGION = 'europe-west1';


// // eslint-disable-next-line @typescript-eslint/no-unused-vars
// import { connectFirestore } from '@foosball/common';
// connectFirestore();

import * as admin from "firebase-admin";
// import * as logger from "firebase-functions/logger";

admin.initializeApp();

// REST API
import { app } from './app';

// locate all functions closest to users
setGlobalOptions({ region: DEFAULT_REGION });

/**
 * HTTP trigger
 * */
export const api = onRequest({ memory: '2GiB', timeoutSeconds: 120 }, app);
