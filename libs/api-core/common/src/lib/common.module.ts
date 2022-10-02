import { DataModule } from '@foosball/api/data';
import { Module } from '@nestjs/common';
import { DataMartService, MatchService, PlayerService, StatsService } from './services';

@Module({
  imports: [DataModule],
  providers: [PlayerService, MatchService, StatsService, DataMartService],
  exports: [PlayerService, MatchService, StatsService, DataMartService],
})
export class ApiCommonModule {}
