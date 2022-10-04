import { Module } from '@nestjs/common';

import { CoreModule } from '@foosball/api/core';
import { DataModule } from '@foosball/api/data';
import { MatchesController } from './controllers/matches.controller';
import { PlayersController } from './controllers/players.controller';
import { MatchService, PlayerService, StatsService } from '@foosball/api/common';

@Module({
  imports: [DataModule, CoreModule],
  controllers: [PlayersController, MatchesController],
  providers: [PlayerService, MatchService, StatsService],
})
export class AppModule {}
