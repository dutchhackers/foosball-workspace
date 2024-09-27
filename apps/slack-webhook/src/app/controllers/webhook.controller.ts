import express, { Request, Response } from 'express';
import * as logger from 'firebase-functions/logger';
import { DateTime } from 'luxon';
import { addViewedBySnippetToBlock, SlackHelper } from '../../core/utils';

const router = express.Router();

import {
  formatKroepnLeaderboardRow,
  PlayerService,
  parseSlackUser,
  Callback,
  IOption,
  MatchService,
  IFinalScore,
  db,
  GeminiHelper,
} from '@foosball/common';
import { getPlayerCard } from '../../views/slack';
import { WebClient } from '@slack/web-api';
import { SLACK_DEDICATED_CHANNEL, SLACK_OAUTH_ACCESS_TOKEN } from '../../core/config';

router.post('/foosball', async (req: Request, res: Response) => {
  const slackClient = new WebClient(SLACK_OAUTH_ACCESS_TOKEN);

  const payload = req.body;
  console.log('[foosball] Received', payload);

  await SlackHelper.acknowledge(res);
  console.log('[foosball] Event Acknowledged');

  await slackClient.dialog.open({
    trigger_id: payload.trigger_id,
    dialog: {
      callback_id: Callback.FOOSBALL_MATCH,
      title: 'Foosball Match',
      submit_label: 'Submit',
      // "notify_on_cancel": true,
      elements: [
        {
          label: 'Team 1 - Player 1',
          name: 'team1player1',
          type: 'select',
          data_source: 'external',
        },
        {
          label: 'Team 1 - Player 2',
          placeholder: '',
          name: 'team1player2',
          type: 'select',
          data_source: 'external',
          optional: true,
        },
        {
          label: 'Score Team 1',
          name: 'score1',
          type: 'text',
          subtype: 'number',
        },
        {
          label: 'Team 2 - Player 1',
          name: 'team2player1',
          type: 'select',
          data_source: 'external',
        },
        {
          label: 'Team 2 - Player 2',
          placeholder: '',
          name: 'team2player2',
          type: 'select',
          data_source: 'external',
          optional: true,
        },
        {
          label: 'Score Team 2',
          name: 'score2',
          type: 'text',
          subtype: 'number',
        },
      ],
    },
  });
  console.log('[foosball] Dialog sent');
});

router.post('/update-me', async (req: Request, res: Response) => {
  const slackClient = new WebClient(SLACK_OAUTH_ACCESS_TOKEN);
  const playerService = new PlayerService();

  const payload = req.body;
  logger.debug('[update-me] Received', payload);

  const userId = payload.user_id;

  await SlackHelper.acknowledge(res);

  const player = await playerService.getPlayerBySlackId(userId);

  await slackClient.dialog.open({
    trigger_id: payload.trigger_id,
    dialog: {
      callback_id: Callback.UPDATE_ME,
      title: 'Profile',
      submit_label: 'Save',
      // notify_on_cancel: true,
      elements: [
        {
          label: 'Nickname',
          name: 'nickname',
          type: 'text',
          placeholder: 'Your nickname...',
          value: player.nickname,
          optional: true,
        },
        {
          label: 'Status',
          name: 'status',
          type: 'text',
          placeholder: 'Your status...',
          value: player.status,
          optional: true,
        },
        {
          label: 'Quote',
          name: 'quote',
          type: 'text',
          placeholder: 'Your quote...',
          value: player.quote,
          optional: true,
        },
      ],
    },
  });
  // console.log('[update-me] Dialog sent');
});

router.post('/kroepn-leaderboard', async (req: Request, res: Response) => {
  const slackClient = new WebClient(SLACK_OAUTH_ACCESS_TOKEN);
  const payload = req.body;
  logger.debug('[kroepn-leaderboard] Received', payload);

  await SlackHelper.acknowledge(res);

  const timestamp = DateTime.local().plus({ day: -30 }); // Filter on players who did play in the last N days
  const leaderboard = await SlackHelper.getDefaultLeaderboard(db, {
    minDateLastMatch: timestamp.toISO(),
  });
  const rankingText = leaderboard.ranking.map(formatKroepnLeaderboardRow).join('\n');
  const rankingAsText = "*Kroep'n Leaderboard:* \n\n" + rankingText;

  const responseMessage: any = {
    channel: payload.channel_id,
    text: rankingAsText,
    mrkdwn: true,
    // blocks: [await getBlockRequestedBy(payload.user_id)],
  };

  return slackClient.chat.postMessage(responseMessage);
});

router.post('/player-card', async (req: Request, res: Response) => {
  const client = new WebClient(SLACK_OAUTH_ACCESS_TOKEN, {
    // logLevel: LogLevel.DEBUG,
  });

  const geminiHelper = new GeminiHelper();

  const payload = req.body;

  console.log('[player-card] Received', payload);

  await SlackHelper.acknowledge(res);

  try {
    const slackUser = parseSlackUser(payload.text);
    const playerService = new PlayerService();
    const player = await playerService.getPlayerBySlackId(slackUser.id || payload.user_id);

    if (!player) {
      return {
        text: 'sorry, I cannot find this player',
      };
    }

    const playerCardData = getPlayerCard(player);

    await client.chat.postMessage({
      channel: payload.channel_id,
      text: `View stats of ${player.displayName}`,
      blocks: addViewedBySnippetToBlock(playerCardData, payload.user_id),
      mrkdwn: true,
    });

    const slackMessage = await geminiHelper.generateProfileCardReview(playerCardData);

    await client.chat.postMessage({
      channel: payload.channel_id,
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: 'Chuck Says:',
          },
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: slackMessage,
          },
          accessory: {
            type: 'image',
            image_url: 'https://img.icons8.com/plasticine/12x/chuck-norris.png',
            alt_text: 'chuck says hi',
          },
        },
      ],
      mrkdwn: true,
    });
  } catch (e) {
    console.log('[player-card] Error', e);
    return;
  }
});

router.post('/interactive', async (req: Request, res: Response) => {
  console.log('[interactive] Received');

  const slackClient = new WebClient(SLACK_OAUTH_ACCESS_TOKEN);

  const playerService = new PlayerService();
  const matchService = new MatchService();

  const data = JSON.parse(req.body.payload);
  logger.info('[/interactive data]', data);

  const { user, submission, callback_id } = data;
  const channelId = data.channel.id;

  switch (callback_id) {
    case Callback.FOOSBALL_MATCH: {
      const { team1player1, team1player2, team2player1, team2player2, score1, score2 } = submission;
      const errors = [];
      if (isNaN(score1)) {
        errors.push({
          name: 'score1',
          error: "Sorry, that ain't a number",
        });
      }
      if (isNaN(score2)) {
        errors.push({
          name: 'score2',
          error: "Sorry, that ain't a number",
        });
      }
      if (errors.length) {
        // Return with error messages
        // return SlackHelper.send(res, { errors });
        return { errors };
      }

      // Send ACK, to prevent time-out
      SlackHelper.acknowledge(res);

      const homeTeam = [team1player1];
      if (team1player2) homeTeam.push(team1player2);
      const awayTeam = [team2player1];
      if (team2player2) awayTeam.push(team2player2);
      const finalScore: IFinalScore = [parseInt(score1), parseInt(score2)];

      console.log('[interactive] Add match result', {
        homeTeam,
        awayTeam,
        finalScore,
      });

      // const matchService = new MatchService(Firestore.db);
      await matchService.addSimpleMatchResult(homeTeam, awayTeam, finalScore);

      const players = await playerService.getPlayersById([...homeTeam, ...awayTeam]);

      const homeTeamString = SlackHelper.concatPlayersString(homeTeam, players);
      const awayTeamString = SlackHelper.concatPlayersString(awayTeam, players);

      return slackClient.chat.postMessage({
        channel: SLACK_DEDICATED_CHANNEL || channelId,
        text: SlackHelper.buildMatchResultString(homeTeamString, awayTeamString, finalScore),
      });
    }
    case Callback.UPDATE_ME: {
      const { nickname, status, quote } = submission;

      const player = await playerService.getPlayerBySlackId(user.id);
      await playerService.updatePlayer(player.id, {
        nickname,
        status,
        quote,
      });

      await SlackHelper.acknowledge(res);

      slackClient.chat.postEphemeral({
        user: user.id,
        channel: channelId,
        text: SlackHelper.buildUpdateProfileString(player),
      });
    }
  }
});

router.post('/options-load-endpoint', async (req: Request, res: Response) => {
  const payload = JSON.parse(req.body.payload);
  console.log('[options-load-endpoint] Received', payload);

  const playerService = new PlayerService();

  const { callback_id, name, value } = payload;
  // name: name of dialog field.
  // value: value entered by user.

  const options: IOption[] = [];

  switch (callback_id) {
    case Callback.FOOSBALL_MATCH: {
      const playerOptions = await SlackHelper.getExternalDataOptions(playerService, 'players');
      const filteredPlayerOptions = playerOptions.filter((option: IOption) => option.label.toLowerCase().indexOf(value.toLowerCase()) >= 0);
      options.push(...filteredPlayerOptions);
      break;
    }
  }
  return SlackHelper.send(res, {
    options,
  });
});

export { router as WebhookController };
