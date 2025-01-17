import * as logger from 'firebase-functions/logger';

import { onRequest } from 'firebase-functions/v2/https';
import { setGlobalOptions } from 'firebase-functions/v2/options';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';

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

// Firestore trigger for new matches
export const onNewMatch = onDocumentCreated('matches/{matchId}', async event => {
  const matchData = event.data?.data();

  // Only process if document exists and has toto field
  if (!matchData || !matchData.toto) {
    logger.info('Skipping document - no data or toto field');
    return;
  }

  const matchResult = matchData as MatchResult;
  logger.info('New match created:', { matchId: event.params.matchId, matchResult });

  const homeTeam = [...matchResult.homeTeamIds];
  const awayTeam = [...matchResult.awayTeamIds];

  const playerService = new PlayerService();
  const players = await playerService.getPlayersById([...homeTeam, ...awayTeam]);

  const homeTeamString = SlackHelper.concatPlayersString(homeTeam, players);
  const awayTeamString = SlackHelper.concatPlayersString(awayTeam, players);

  const slackClient = new WebClient(SLACK_OAUTH_ACCESS_TOKEN);

  return slackClient.chat.postMessage({
    channel: SLACK_DEDICATED_CHANNEL,
    text: SlackHelper.buildMatchResultString(homeTeamString, awayTeamString, matchResult.finalScore),
  });
});
