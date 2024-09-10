import { defineString } from "firebase-functions/params";

export const SLACK_OAUTH_ACCESS_TOKEN = defineString('SLACK_OAUTH_ACCESS_TOKEN').value(); 
export const SLACK_DEDICATED_CHANNEL = defineString('SLACK_DEDICATED_CHANNEL').value();
