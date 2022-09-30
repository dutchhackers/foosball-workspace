// import * as dotenv from 'dotenv';
// import * as functions from 'firebase-functions';

// dotenv.config();
// let path;
// switch (process.env.NODE_ENV) {
//   case 'production':
//     path = `${__dirname}/../../.env.production`;
//     break;
//   default:
//     process.env.NODE_ENV = 'development';
//     path = `${__dirname}/../../.env.development`;
// }
// dotenv.config({ path: path });

const slackConfig = undefined; // const { slack: slackConfig } = functions.config();

export const DATABASE_URL = process.env.DATABASE_URL;
export const SERVICE_ACCOUNT = process.env.SERVICE_ACCOUNT;
export const SLACK_OAUTH_ACCESS_TOKEN = slackConfig ? slackConfig.access_token : process.env.SLACK_OAUTH_ACCESS_TOKEN;
export const SLACK_DEDICATED_CHANNEL = slackConfig ? slackConfig.dedicated_channel : process.env.SLACK_DEDICATED_CHANNEL;
