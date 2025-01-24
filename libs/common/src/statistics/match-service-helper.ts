import { IMatchCubeItem, ICubeItem } from '.';
import { MatchResult } from '../models';
import { TimeDimension } from './time-dimension';
// import * as moment from 'moment';
// import { ICubeItem } from '../models/cube-item';
// import { IMatchCubeItem } from '../models/match-cube-item';

export class MatchServiceHelper {
  static GetMatchCube(match: MatchResult): IMatchCubeItem[] {
    const cube: IMatchCubeItem[] = [];
    const timeDim = new TimeDimension(match.matchDate);
    const matchId = (match as any)._docId;

    const ci: IMatchCubeItem = {
      _key: `${matchId}`,
      dim_match: (match as any)._docId,
      dim_time: timeDim.isoDate,
      dim_day: timeDim.dayKey,
      dim_wk: timeDim.weekKey,
      dim_month: timeDim.monthKey,
      count_match: 1,
      count_goals_home: match.finalScore[0],
      count_goals_away: match.finalScore[1],
      count_goals_delta: match.getWinDelta(),
      count_fatality: match.hasHumiliation ? 1 : 0,
      count_sucker_punch: match.hasSuckerPunch ? 1 : 0,
      count_players: match.totalPlayers,
    };
    cube.push(ci);
    return cube;
  }

  static GetMatchPlayerCube(match: MatchResult): ICubeItem[] {
    const cube: ICubeItem[] = [];
    const timeDim = new TimeDimension(match.matchDate);
    const matchId = (match as any)._docId;
    const count_total_players = match.totalPlayers;

    for (const p of [...match.homeTeamIds, ...match.awayTeamIds]) {
      const count_win = match.checkPlayerWin(p) === true ? 1 : 0;
      const count_flawless = match.checkPlayerFlawlessWin(p) === true ? 1 : 0;
      const count_humiliation = match.checkPlayerFlawlessLose(p) === true ? 1 : 0;
      const count_goals_with = match.getTotalGoalsWith(p);
      const count_goals_against = match.getTotalGoalsAgainst(p);
      const count_did_sucker_punch = match.checkPlayerDidSuckerPunch(p) === true ? 1 : 0;
      const count_got_sucker_punched = match.checkPlayerGotSuckerPunched(p) === true ? 1 : 0;

      const _team = match.getTeamPlayerIds(p);
      const _opponents = match.getOpponentPlayerIds(p);

      const ci: ICubeItem = {
        _key: `${matchId}_${p}`,
        dim_player: p,
        dim_team: _team.join(','),
        dim_opponents: _opponents.join(','),
        dim_match: (match as any)._docId,
        dim_time: timeDim.isoDate,
        dim_day: timeDim.dayKey,
        dim_wk: timeDim.weekKey,
        dim_month: timeDim.monthKey,
        count_match: 1,
        count_win,
        count_goals_with,
        count_goals_against,
        count_flawless,
        count_humiliation,
        count_players: count_total_players,
        count_did_sucker_punch,
        count_got_sucker_punched,
      };
      cube.push(ci);
    }

    return cube;
  }
}
