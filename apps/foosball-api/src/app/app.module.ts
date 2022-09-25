import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { DataModule } from '@foosball/data';
import { CoreModule } from '@foosball/core';

@Module({
  imports: [DataModule, CoreModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
