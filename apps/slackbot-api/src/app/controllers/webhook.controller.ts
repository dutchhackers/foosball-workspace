import { Body, Controller, Post } from '@nestjs/common';

import { WebClient } from '@slack/web-api';
import { SLACK_OAUTH_ACCESS_TOKEN, SLACK_DEDICATED_CHANNEL } from '../core/config';

import { formatKroepnLeaderboardRow, PlayerService, parseSlackUser, Callback } from '@foosball/api/common';
import { DataService } from '@foosball/api/data';
import { DateTime } from 'luxon';
import { SlackHelper, addViewedBySnippetToBlock } from '../core/utils';
import { getPlayerCard } from '../views/slack';
import { IFinalScore } from '@foosball/dto';

@Controller('')
export class WebhookController {
  private client: WebClient;

  constructor(private readonly data: DataService, private readonly playerService: PlayerService) {
    this.client = new WebClient(SLACK_OAUTH_ACCESS_TOKEN);
  }

  @Post('exec-cmd')
  async runCommand(@Body() slackRequest: any) {
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
        return this.runFoosballCommand();

      case 'update-me':
      case 'um':
        console.log('Run cmd: update-me');
        return this.runUpdateMeCommand(slackRequest);

      default:
        console.log('Run cmd: leaderboard');
        return this.getLeaderboard(slackRequest);
    }
  }

  @Post('foosball')
  async runFoosballCommand() {
    return {
      text: 'Sorry, this command will be back soon.',
    };
  }

  @Post('update-me')
  async runUpdateMeCommand(@Body() input: any) {
    const payload = input;
    console.log('[update-me] Received', payload);

    // await SlackHelper.acknowledge();
    // console.log('[update-me] Event Acknowledged');

    const { user_id } = payload;
    const player = await this.playerService.getPlayerBySlackId(user_id);

    await this.client.dialog.open({
      trigger_id: payload.trigger_id,
      dialog: {
        callback_id: Callback.UPDATE_ME,
        title: 'Profile',
        submit_label: 'Save',
        notify_on_cancel: true,
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

  @Post('player-card')
  async getPlayerCard(@Body() input: any) {
    const payload = input;
    console.log('[player-card] Received', payload);

    await SlackHelper.acknowledge();

    try {
      const slackUser = parseSlackUser(payload.text);
      // const playerService = new PlayerService(/* Firestore.db*/);
      const player = await this.playerService.getPlayerBySlackId(slackUser.id || payload.user_id);

      if (!player) {
        return {
          text: 'sorry, I cannot find this player',
        };
      }

      return this.client.chat.postMessage({
        channel: payload.channel_id,
        text: `View stats of ${player.displayName}`,
        blocks: addViewedBySnippetToBlock(getPlayerCard(player), payload.user_id),
        mrkdwn: true,
      });
    } catch (e) {
      console.log('[player-card] Error', e);
      return;
    }
  }

  @Post('interactive')
  async interactiveCallback(@Body() input: any) {
    const payload = input; // JSON.parse(req.body.payload);
    console.log('[interactive] Received', payload);

    const { user, submission, callback_id } = payload;

    // const playerService = new PlayerService(Firestore.db);
    switch (callback_id) {
      case Callback.FOOSBALL_MATCH:
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
        // SlackHelper.acknowledge(res);

        const homeTeam = [team1player1];
        if (team1player2) homeTeam.push(team1player2);
        const awayTeam = [team2player1];
        if (team2player2) awayTeam.push(team2player2);
        const finalScore: IFinalScore = [parseInt(score1), parseInt(score2)];

        console.log('[interactive] Add match result', { homeTeam, awayTeam, finalScore });

        // const matchService = new MatchService(Firestore.db);
        // await this.matchService.addSimpleMatchResult(homeTeam, awayTeam, finalScore);

        const players = await this.playerService.getPlayersById([...homeTeam, ...awayTeam]);

        const homeTeamString = SlackHelper.concatPlayersString(homeTeam, players);
        const awayTeamString = SlackHelper.concatPlayersString(awayTeam, players);

        return this.client.chat.postMessage({
          channel: SLACK_DEDICATED_CHANNEL || payload.channel.id,
          text: SlackHelper.buildMatchResultString(homeTeamString, awayTeamString, finalScore),
        });
      case Callback.UPDATE_ME:
        const { nickname, status, quote } = submission;

        const player = await this.playerService.getPlayerBySlackId(user.id);
        await this.playerService.updatePlayer(player.id, { nickname, status, quote });
        // await SlackHelper.acknowledge();
        return this.client.chat.postEphemeral({
          user: user.id,
          channel: payload.channel.id,
          text: SlackHelper.buildUpdateProfileString(player),
        });
      // break;
    }
    return SlackHelper.acknowledge();
  }
}
