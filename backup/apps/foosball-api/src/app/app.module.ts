import { Module } from '@nestjs/common';

import { AuthModule } from '@foosball/api/auth';
import { DataMartService, MatchService, PlayerService, StatsService } from '@foosball/api/common';
import { CoreModule } from '@foosball/api/core';
import { DataModule } from '@foosball/api/data';
import { MatchesController } from './controllers/matches.controller';
import { PlayersController } from './controllers/players.controller';
import { AuthController } from './controllers/auth.controller';
import { DataController } from './controllers/data.controller';
import { MatchResultsController } from './controllers/match-results.controller';
import { FirebaseNestModule } from '@foosball/firebase-nest';

@Module({
  imports: [
    DataModule,
    CoreModule,
    AuthModule,
    FirebaseNestModule.forRoot({
      apiKey: process.env.FIREBASE_API_KEY,
      authDomain: `${process.env.FIREBASE_PROJECT}.firebaseapp.com`,
      projectId: process.env.FIREBASE_PROJECT,
      storageBucket: `${process.env.FIREBASE_PROJECT}.appspot.com`,
      appName: 'foosball',
    }),
  ],
  controllers: [AuthController, PlayersController, MatchesController, DataController, MatchResultsController],
  providers: [PlayerService, MatchService, StatsService, DataMartService],
})
export class AppModule {}
