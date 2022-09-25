import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DataModule } from '@foosball/data';
import { CoreModule } from '@foosball/core';
import { PlayersController } from './controllers/players.controller';
import { PlayerService } from './services/player.service';

@Module({
  imports: [DataModule, CoreModule],
  controllers: [AppController, PlayersController],
  providers: [AppService, PlayerService],
})
export class AppModule {}
