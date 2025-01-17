import * as logger from 'firebase-functions/logger';

import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2/options';
import { onMessagePublished } from 'firebase-functions/v2/pubsub';

import './config';

const DEFAULT_REGION = 'europe-west1';

// // eslint-disable-next-line @typescript-eslint/no-unused-vars
import { connectFirestore, MatchResult, PlayerService } from '@foosball/common';
connectFirestore();

// REST API
import { app } from './app';
import { SlackHelper } from './core/utils';
import { WebClient } from '@slack/web-api';
import { SLACK_DEDICATED_CHANNEL, SLACK_OAUTH_ACCESS_TOKEN } from './core/config';

// locate all functions closest to users
setGlobalOptions({ region: DEFAULT_REGION });

/**
 * HTTP trigger
 * */
export const slackWebhook = onRequest({ memory: '2GiB', timeoutSeconds: 120 }, app);

logger.info('Slack Webhook function initialized');

// New PubSub trigger for new-match events
export const onNewMatch = onMessagePublished('new-match', async event => {
  const matchResult = event.data.message.json as MatchResult;
  const publishTime = event.data.message.publishTime;

  logger.info('New match event received:', {
    matchResult,
    publishTime,
    messageId: event.data.message.messageId,
    publisherData: event.data.message.attributes,
  });

  const homeTeam = [...matchResult.homeTeamIds];
  const awayTeam = [...matchResult.awayTeamIds];

  const playerService = new PlayerService();
  const players = await playerService.getPlayersById([...homeTeam, ...awayTeam]);

  const homeTeamString = SlackHelper.concatPlayersString(homeTeam, players);
  const awayTeamString = SlackHelper.concatPlayersString(awayTeam, players);

  const slackClient = new WebClient(SLACK_OAUTH_ACCESS_TOKEN);

  return slackClient.chat.postMessage({
    channel: 'C044RKF18VA', //SLACK_DEDICATED_CHANNEL,
    text: SlackHelper.buildMatchResultString(homeTeamString, awayTeamString, matchResult.finalScore),
  });
});
