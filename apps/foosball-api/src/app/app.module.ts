import { Module } from '@nestjs/common';

import { AuthModule } from '@foosball/api/auth';
import { MatchService, PlayerService, StatsService } from '@foosball/api/common';
import { CoreModule } from '@foosball/api/core';
import { DataModule } from '@foosball/api/data';
import { MatchesController } from './controllers/matches.controller';
import { PlayersController } from './controllers/players.controller';
import { AuthController } from './controllers/auth.controller';

@Module({
  imports: [DataModule, CoreModule, AuthModule],
  controllers: [AuthController, PlayersController, MatchesController],
  providers: [PlayerService, MatchService, StatsService],
})
export class AppModule {}
