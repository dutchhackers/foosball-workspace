import { Body, Controller, Get, Post, Res } from '@nestjs/common';

import { WebClient } from '@slack/web-api';
import { SLACK_OAUTH_ACCESS_TOKEN, SLACK_DEDICATED_CHANNEL } from './core/utils/config';

import { AppService } from './app.service';
import { PlayerService } from './core/services/player.service';
import { parseSlackUser } from './core/utils';
import { addViewedBySnippetToBlock, SlackHelper } from './core/utils/slack-helper';
import { getPlayerCard } from './views/slack';

@Controller()
export class AppController {
  private client: WebClient;

  constructor(private readonly appService: AppService, private readonly playerService: PlayerService) {
    console.log(SLACK_OAUTH_ACCESS_TOKEN);
    this.client = new WebClient(SLACK_OAUTH_ACCESS_TOKEN);
  }

  @Get()
  getData() {
    return this.appService.getData();
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
