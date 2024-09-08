import express, { Request, Response } from 'express';
import * as logger from 'firebase-functions/logger';
import { addViewedBySnippetToBlock, SlackHelper } from '../../core/utils';

// import { PlayerService } from '@foosball/common';

const router = express.Router();

// import { WebClient, LogLevel } from '@slack/web-api';
// import { SLACK_OAUTH_ACCESS_TOKEN, SLACK_DEDICATED_CHANNEL } from '../../core/config';

import {
  formatKroepnLeaderboardRow,
  PlayerService,
  parseSlackUser,
  Callback,
  IOption,
  MatchService,
} from '@foosball/common';
import { getPlayerCard } from '../../views/slack';
import { LogLevel, WebClient } from '@slack/web-api';
import { SLACK_OAUTH_ACCESS_TOKEN } from '../../core/config';
// import { DataService } from '@foosball/api/data';
// import { DateTime } from 'luxon';
// import { SlackHelper, addViewedBySnippetToBlock } from '../../core/utils';
// import { getPlayerCard } from '../../views/slack';
// import { IFinalScore } from '@foosball/dto';
// import { Response } from 'express';
// import { SlackUser } from '../../core/decorators';
// import { SlackAuthGuard } from '../../core/guards';
// import { ISlackUser } from '../../core/interfaces';

/*

@Controller('')
export class WebhookController {
  private client: WebClient;

  constructor(
    private readonly data: DataService,
    private readonly playerService: PlayerService,
    private readonly matchService: MatchService
  ) {
    this.client = new WebClient(SLACK_OAUTH_ACCESS_TOKEN, {
      // logLevel: LogLevel.DEBUG,
    });
  }

  @Post('exec-cmd')
  @UseGuards(SlackAuthGuard)
  async runCommand(@Body() slackRequest: any, @Res() response: Response, @SlackUser() user: ISlackUser) {
    const cmd = slackRequest.text;
    console.log('Run cmd: ' + cmd);

    switch (cmd) {
      case 'lb':
      case 'leaderboard':
        console.log('Run cmd: leaderboard');
        return this.getLeaderboard(slackRequest);

      case 'pc':
      case 'player-card':
        console.log('Run cmd: playercard');
        return this.getPlayerCard(slackRequest);

      case 'foosball':
      case 'fb':
        console.log('Run cmd: foosball');
        return this.runFoosballCommand(slackRequest, response);

      case 'update-me':
      case 'um':
        console.log('Run cmd: update-me');
        return this.runUpdateMeCommand(user, slackRequest);
    }
  }

  @Post('foosball')
  async runFoosballCommand(@Body() input: any, @Res() response: Response) {
    const payload = input;
    console.log('[foosball] Received', payload);

    await SlackHelper.acknowledge(response);
    console.log('[foosball] Event Acknowledged');

    await this.client.dialog.open({
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
  }
*/

/*
  @Post('update-me')
  @UseGuards(SlackAuthGuard)
  async runUpdateMeCommand(@SlackUser() user: ISlackUser, @Body() input: any) {
    const payload = input;
    Logger.debug('[update-me] Received', payload);

    // await SlackHelper.acknowledge();
    // console.log('[update-me] Event Acknowledged');

    const player = await this.playerService.getPlayerBySlackId(user.userId);

    await this.client.dialog.open({
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
  }

  @Post('kroepn-leaderboard')
  async getLeaderboard(@Body() input: any) {
    const payload = input;
    console.log('[kroepn-leaderboard] Received', payload);

    await SlackHelper.acknowledge();

    const timestamp = DateTime.local().plus({ day: -30 }); // Filter on players who did play in the last N days
    const leaderboard = await SlackHelper.getDefaultLeaderboard(this.data, { minDateLastMatch: timestamp.toISO() });
    const rankingText = leaderboard.ranking.map(formatKroepnLeaderboardRow).join('\n');
    const rankingAsText = "*Kroep'n Leaderboard:* \n\n" + rankingText;

    const responseMessage: any = {
      channel: payload.channel_id,
      text: rankingAsText,
      mrkdwn: true,
      // blocks: [await getBlockRequestedBy(payload.user_id)],
    };

    return this.client.chat.postMessage(responseMessage);
  }
*/

router.post('/player-card', async (req: Request, res: Response) => {
  const client = new WebClient(SLACK_OAUTH_ACCESS_TOKEN, {
    // logLevel: LogLevel.DEBUG,
  });


  const payload = req.body;

  console.log('[player-card] Received', payload);

  await SlackHelper.acknowledge(res);

  try {
    const slackUser = parseSlackUser(payload.text);
    const playerService = new PlayerService();
    const player = await playerService.getPlayerBySlackId(
      slackUser.id || payload.user_id
    );

    if (!player) {
      return {
        text: 'sorry, I cannot find this player',
      };
    }

    return client.chat.postMessage({
      channel: payload.channel_id,
      text: `View stats of ${player.displayName}`,
      blocks: addViewedBySnippetToBlock(getPlayerCard(player), payload.user_id),
      mrkdwn: true,
    });
  } catch (e) {
    console.log('[player-card] Error', e);
    return;
  }
});

/*
  // @HttpCode(200)
  @Post('interactive')
  async interactiveCallback(@Body() input: any, @Res() response: Response) {
    console.log('[interactive] Received');

    const payload = JSON.parse(input.payload);
    console.log(payload);

    const { user, submission, callback_id } = payload;

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
        SlackHelper.acknowledge(response);

        const homeTeam = [team1player1];
        if (team1player2) homeTeam.push(team1player2);
        const awayTeam = [team2player1];
        if (team2player2) awayTeam.push(team2player2);
        const finalScore: IFinalScore = [parseInt(score1), parseInt(score2)];

        console.log('[interactive] Add match result', { homeTeam, awayTeam, finalScore });

        // const matchService = new MatchService(Firestore.db);
        await this.matchService.addSimpleMatchResult(homeTeam, awayTeam, finalScore);

        const players = await this.playerService.getPlayersById([...homeTeam, ...awayTeam]);

        const homeTeamString = SlackHelper.concatPlayersString(homeTeam, players);
        const awayTeamString = SlackHelper.concatPlayersString(awayTeam, players);

        return this.client.chat.postMessage({
          channel: SLACK_DEDICATED_CHANNEL || payload.channel.id,
          text: SlackHelper.buildMatchResultString(homeTeamString, awayTeamString, finalScore),
        });
      }
      case Callback.UPDATE_ME: {
        const { nickname, status, quote } = submission;

        const player = await this.playerService.getPlayerBySlackId(user.id);
        await this.playerService.updatePlayer(player.id, { nickname, status, quote });

        // await SlackHelper.acknowledge();
        await SlackHelper.acknowledge(response);

        this.client.chat.postEphemeral({
          user: user.id,
          channel: payload.channel.id,
          text: SlackHelper.buildUpdateProfileString(player),
        });
      }
    }
  }

  */

/*

  @Post('options-load-endpoint')
  async optionsLoadCallback(@Body() input: any, @Res() response: Response) {
    const payload = JSON.parse(input.payload);
    console.log('[options-load-endpoint] Received', payload);

    const { callback_id, name, value } = payload;
    // name: name of dialog field.
    // value: value entered by user.

    const options: IOption[] = [];

    switch (callback_id) {
      case Callback.FOOSBALL_MATCH: {
        const playerOptions = await SlackHelper.getExternalDataOptions(this.playerService, 'players');
        const filteredPlayerOptions = playerOptions.filter(
          (option: IOption) => option.label.toLowerCase().indexOf(value.toLowerCase()) >= 0
        );
        options.push(...filteredPlayerOptions);
        break;
      }
    }
    return SlackHelper.send(response, {
      options,
    });
  }
}

*/

export { router as WebhookController };
