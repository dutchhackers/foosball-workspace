import { Module } from '@nestjs/common';

import { AuthModule } from '@foosball/api/auth';
import { DataMartService, MatchService, PlayerService, StatsService } from '@foosball/api/common';
import { CoreModule } from '@foosball/api/core';
import { DataModule } from '@foosball/api/data';
import { MatchesController } from './controllers/matches.controller';
import { PlayersController } from './controllers/players.controller';
import { AuthController } from './controllers/auth.controller';
import { DataController } from './controllers/data.controller';

@Module({
  imports: [DataModule, CoreModule, AuthModule],
  controllers: [AuthController, PlayersController, MatchesController, DataController],
  providers: [PlayerService, MatchService, StatsService, DataMartService],
})
export class AppModule {}
