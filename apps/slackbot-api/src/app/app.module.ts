import { CoreModule } from '@foosball/core';
import { DataModule } from '@foosball/data';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerService } from './core/services/player.service';
import { MatchService } from './core/services/match.service';
import { StatsService } from './core/services/stats.service';
import { DataMartService } from './core/services/datamart.service';

@Module({
  imports: [DataModule, CoreModule],
  controllers: [AppController],
  providers: [AppService, PlayerService, MatchService, StatsService, DataMartService],
})
export class AppModule {}
