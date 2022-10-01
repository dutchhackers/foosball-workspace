import { CoreModule } from '@foosball/core';
import { DataModule } from '@foosball/data';
import { Module } from '@nestjs/common';

import { WebhookController } from './controllers/webhook.controller';
import { DataMartService } from './core/services/datamart.service';
import { MatchService } from './core/services/match.service';
import { PlayerService } from './core/services/player.service';
import { StatsService } from './core/services/stats.service';

@Module({
  imports: [DataModule, CoreModule],
  controllers: [WebhookController],
  providers: [PlayerService, MatchService, StatsService, DataMartService],
})
export class AppModule {}
