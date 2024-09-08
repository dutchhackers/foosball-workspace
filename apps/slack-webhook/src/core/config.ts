import { defineString } from "firebase-functions/params";

const slackConfig: any = undefined; // TODO: refactor later
export const SLACK_OAUTH_ACCESS_TOKEN = defineString('SLACK_OAUTH_ACCESS_TOKEN').value(); //slackConfig ? slackConfig.access_token : process.env.SLACK_OAUTH_ACCESS_TOKEN;
export const SLACK_DEDICATED_CHANNEL = slackConfig ? slackConfig.dedicated_channel : process.env.SLACK_DEDICATED_CHANNEL;
