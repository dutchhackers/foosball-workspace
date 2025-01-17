import * as logger from 'firebase-functions/logger';
import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { MatchResult, PlayerService } from '@foosball/common';
import { SlackHelper } from '../core/utils';
import { WebClient } from '@slack/web-api';
import { SLACK_DEDICATED_CHANNEL, SLACK_OAUTH_ACCESS_TOKEN } from '../core/config';

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
