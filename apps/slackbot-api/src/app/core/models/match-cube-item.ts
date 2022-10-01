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
