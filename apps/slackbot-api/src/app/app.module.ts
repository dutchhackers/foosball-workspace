import { CoreModule } from '@foosball/core';
import { DataModule } from '@foosball/data';
import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlayerService } from './core/services/player.service';

@Module({
  imports: [DataModule, CoreModule],
  controllers: [AppController],
  providers: [AppService, PlayerService],
})
export class AppModule {}
