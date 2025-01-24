import { IPlayerStats } from '../interfaces/player.interface';
import { IMatchResult } from '../match/match-result.model';
import { checkFlawlessVictory, checkSuckerPunch } from '../utils/various';

enum EntityType {
  PLAYER,
  TEAM,
}

interface IEntityMatchResult {
  entityKey: string;
  entityType: EntityType;
  matchDate: string;
  didWin: boolean;
  didLose: boolean;
  hasHumiliation: boolean;
  hasSuckerPunch: boolean;
}

export class StatsUtils {
  static calculatePlayerMatchResult(player: string, match: IMatchResult): IEntityMatchResult {
    const winners = [];
    const losers = [];

    if (match.toto === 1) {
      winners.push(...match.homeTeamIds);
      losers.push(...match.awayTeamIds);
    } else if (match.toto === 2) {
      winners.push(...match.awayTeamIds);
      losers.push(...match.homeTeamIds);
    }

    const flags: any = {};
    flags.hasHumiliation = checkFlawlessVictory(match.finalScore);
    flags.hasSuckerPunch = checkSuckerPunch(match.finalScore);

    const entityMatchResult: IEntityMatchResult = {
      matchDate: match.matchDate || new Date().toISOString(),
      entityType: EntityType.PLAYER,
      entityKey: player,
      didWin: winners.indexOf(player) >= 0,
      didLose: losers.indexOf(player) >= 0,
      hasHumiliation: flags.hasHumiliation,
      hasSuckerPunch: flags.hasSuckerPunch,
    };

    return entityMatchResult;
  }

  static calculateUpdatedPlayerStats(playerStats: IPlayerStats, entityMatchResult: IEntityMatchResult) {
    // Update total matches and last match date
    playerStats.totalMatches++;
    playerStats.dateLastMatch = entityMatchResult.matchDate;

    if (entityMatchResult.didWin) {
      playerStats.totalWins++;
      playerStats.dateLastWin = entityMatchResult.matchDate;
      playerStats.winStreak++;
      playerStats.loseStreak = 0;

      // Update highest win streak if current is higher
      if (playerStats.winStreak > (playerStats.highestWinStreak || 0)) {
        playerStats.highestWinStreak = playerStats.winStreak;
      }
    }

    if (entityMatchResult.didLose) {
      playerStats.totalLosses++;
      playerStats.dateLastLose = entityMatchResult.matchDate;
      playerStats.loseStreak++;
      playerStats.winStreak = 0;

      // Update highest lose streak if current is higher
      if (playerStats.loseStreak > (playerStats.highestLoseStreak || 0)) {
        playerStats.highestLoseStreak = playerStats.loseStreak;
      }
    }

    if (entityMatchResult.hasHumiliation) {
      if (entityMatchResult.didWin) {
        playerStats.totalFlawlessVictories++;
        playerStats.dateLastFlawlessVictory = entityMatchResult.matchDate;
      } else {
        playerStats.totalHumiliations++;
        playerStats.dateLastHumiliation = entityMatchResult.matchDate;
      }
    }

    if (entityMatchResult.hasSuckerPunch) {
      if (entityMatchResult.didWin) {
        playerStats.totalSuckerpunches++;
      } else {
        playerStats.totalKnockouts++;
      }
    }
  }
}
