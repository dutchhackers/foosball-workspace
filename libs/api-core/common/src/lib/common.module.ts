import { DataModule } from '@foosball/data';
import { Module } from '@nestjs/common';
import { DataMartService, MatchService, PlayerService, StatsService } from './services';

@Module({
  imports: [DataModule],
  providers: [PlayerService, MatchService, StatsService, DataMartService],
  exports: [PlayerService, MatchService, StatsService, DataMartService],
})
export class ApiCommonModule {}
