import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { CoreModule } from '@coders/api-core/core';
import { DataModule } from '@foosball/api/data';
import { MatchesController } from './controllers/matches.controller';
import { PlayersController } from './controllers/players.controller';
import { MatchService } from './services/match.service';
import { PlayerService } from './services/player.service';

@Module({
  imports: [DataModule, CoreModule],
  controllers: [AppController, PlayersController, MatchesController],
  providers: [AppService, PlayerService, MatchService],
})
export class AppModule {}
