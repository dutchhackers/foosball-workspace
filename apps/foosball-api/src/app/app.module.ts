import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { CoreModule } from '@foosball/api/core';
import { DataModule } from '@foosball/api/data';
import { MatchesController } from './controllers/matches.controller';
import { PlayersController } from './controllers/players.controller';
import { MatchService } from './services/match.service';
import { PlayerService } from './services/player.service';

@Module({
  imports: [DataModule, CoreModule],
  controllers: [AppController, PlayersController, MatchesController],
  providers: [PlayerService, MatchService],
})
export class AppModule {}
