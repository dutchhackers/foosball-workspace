import { Body, Controller, Get, Post, Res } from '@nestjs/common';

import { WebClient } from '@slack/web-api';
import { SLACK_OAUTH_ACCESS_TOKEN, SLACK_DEDICATED_CHANNEL } from './core/utils/config';

import { AppService } from './app.service';
import { PlayerService } from './core/services/player.service';
import { formatKroepnLeaderboardRow, parseSlackUser } from './core/utils';
import { addViewedBySnippetToBlock, SlackHelper } from './core/utils/slack-helper';
import { getPlayerCard } from './views/slack';

import { DateTime } from 'luxon';
import { DataService } from '@foosball/data';

@Controller()
export class AppController {
  private client: WebClient;

  constructor(private readonly appService: AppService, private readonly data: DataService, private readonly playerService: PlayerService) {
    console.log(SLACK_OAUTH_ACCESS_TOKEN);
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
        return this.runFoosballCommand();

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
  async runUpdateMeCommand() {
    return {
      text: 'Sorry, this command will be back soon.',
    };
  }

  @Post('kroepn-leaderboard')
  async getLeaderboard(@Body() input: any) {
    const payload = input;
    console.log('[kroepn-leaderboard] Received', payload);

    await SlackHelper.acknowledge();
    console.log('[kroepn-leaderboard] Event Acknowledged');

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

    // await SlackHelper.acknowledge(res);
    console.log('[player-card] Event Acknowledged');

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
}
