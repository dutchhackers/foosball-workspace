import { EntityType } from './statistics.enum';

export interface IMatchCubeItem {
  _key: string;
  dim_time: string;
  dim_day: string;
  dim_wk: string;
  dim_month: string;
  dim_match: string;
  count_match: number;
  count_goals_home: number;
  count_goals_away: number;
  count_goals_delta: number;
  count_fatality: number;
  count_players: number;
  count_sucker_punch: number;
}

export interface ICubeItem {
  _key: string;
  dim_time: string;
  dim_day: string;
  dim_wk: string;
  dim_month: string;
  dim_player: string;
  dim_team: string;
  dim_opponents: string;
  dim_match: string;
  count_match: number;
  count_win: number;
  count_goals_with: number;
  count_goals_against: number;
  count_flawless: number;
  count_humiliation: number;
  count_players: number;
  count_did_sucker_punch: number;
  count_got_sucker_punched: number;
}

export interface IEntityMatchResult {
  entityKey: string;
  entityType: EntityType;
  matchDate: string;
  didWin: boolean;
  didLose: boolean;
  hasHumiliation: boolean;
  hasSuckerPunch: boolean;
}
