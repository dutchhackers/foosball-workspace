import { FieldValue } from 'firebase-admin/firestore';

import { IMatchResult } from '../models';
import { checkFlawlessVictory, checkSuckerPunch } from '../utils';
import { Collection } from '../utils/firestore-db';
import { CoreService } from '../services/abstract-service';
import { IMetrics } from '.';

const PLAYERS_COLLECTION = Collection.PLAYERS;

// deprecated
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

export interface IStatsService {
  generateStats(matchResult: any): Promise<any>;
}

export class StatsService extends CoreService implements IStatsService {
  constructor() {
    super();
  }

  async generateStats(matchResult: IMatchResult, opts: any = {}): Promise<any> {
    const players = [];
    const winners = [];
    const losers = [];
    const multiplier = opts.multiplier || 1;

    if (matchResult.toto === 1) {
      winners.push(...matchResult.homeTeamIds);
      losers.push(...matchResult.awayTeamIds);
    } else if (matchResult.toto === 2) {
      winners.push(...matchResult.awayTeamIds);
      losers.push(...matchResult.homeTeamIds);
    }

    players.push(...matchResult.homeTeamIds, ...matchResult.awayTeamIds);

    const flags: any = {};
    flags.hasHumiliation = checkFlawlessVictory(matchResult.finalScore);
    flags.hasSuckerPunch = checkSuckerPunch(matchResult.finalScore);

    const entities: IEntityMatchResult[] = [];
    const docRefs: FirebaseFirestore.DocumentReference[] = [];

    for (const player of players) {
      const item: IEntityMatchResult = {
        matchDate: matchResult.matchDate || new Date().toISOString(),
        entityType: EntityType.PLAYER,
        entityKey: player,
        didWin: winners.indexOf(player) >= 0,
        didLose: losers.indexOf(player) >= 0,
        hasHumiliation: flags.hasHumiliation,
        hasSuckerPunch: flags.hasSuckerPunch,
      };

      entities.push(item);
    }

    const batch = this.db.batch();

    for (const entity of entities) {
      let docRef: FirebaseFirestore.DocumentReference;

      switch (entity.entityType) {
        case EntityType.PLAYER:
          docRef = this.db.collection(PLAYERS_COLLECTION).doc(entity.entityKey);
          break;
        default:
          throw new Error('Not Implemented');
      }
      docRefs.push(docRef);

      const metrics = this.calculateMetrics(
        {
          didWin: entity.didWin,
          didLose: entity.didLose,
          hasHumiliation: entity.hasHumiliation,
          hasSuckerPunch: entity.hasSuckerPunch,
        },
        multiplier
      );

      const docData = Object.assign({}, metrics, {
        modificationDate: new Date().toISOString(),
      });
      batch.set(docRef, docData, { merge: true });
    }

    await batch.commit();

    // Update Streak stats
    await this.batchUpdateStreaks(docRefs);
  }

  public async batchUpdateStreaks(docReferences: FirebaseFirestore.DocumentReference[]): Promise<void> {
    if (!docReferences) {
      return;
    }

    const batch = this.db.batch();
    let maxStreakChanged = false;

    for (const docRef of docReferences) {
      const snapshot: any = await docRef.get();
      const data = snapshot.data();

      // Win streak
      const currentWinStreak = data.winStreak || 0;
      const highestWinStreak = data.highestWinStreak || 0;

      // Lose streak
      const currentLoseStreak = data.loseStreak || 0;
      const highestLoseStreak = data.highestLoseStreak || 0;

      const isoTimestamp = new Date().toISOString();

      if (currentWinStreak > highestWinStreak) {
        maxStreakChanged = true;
        batch.set(docRef, { highestWinStreak: currentWinStreak }, { merge: true });
      }

      if (currentLoseStreak > highestLoseStreak) {
        maxStreakChanged = true;
        batch.set(docRef, { highestLoseStreak: currentLoseStreak }, { merge: true });
      }
    }

    if (maxStreakChanged) {
      await batch.commit();
    }
  }

  private calculateMetrics(flags: any = {}, multiplier = 1): IMetrics {
    const metrics: IMetrics = {};
    const now = new Date().toISOString();

    // Increase number of played matches
    metrics.totalMatches = FieldValue.increment(multiplier * 1);
    metrics.dateLastMatch = now;

    if (flags.didWin === true) {
      metrics.totalWins = FieldValue.increment(multiplier * 1);
      metrics.dateLastWin = now;

      if (flags.hasHumiliation) {
        // i.e. made someone 'Kroepn'
        metrics.totalFlawlessVictories = FieldValue.increment(multiplier * 1);
        metrics.dateLastFlawlessVictory = now;
      }

      if (flags.hasSuckerPunch) {
        metrics.totalSuckerpunches = FieldValue.increment(multiplier * 1);
      }
    }

    if (flags.didLose === true) {
      metrics.totalLosses = FieldValue.increment(multiplier * 1);
      metrics.dateLastLose = now;

      if (flags.hasHumiliation) {
        // i.e. made someone 'Kroepn'
        metrics.totalHumiliations = FieldValue.increment(multiplier * 1);
        metrics.dateLastHumiliation = now;
      }

      if (flags.hasSuckerPunch) {
        metrics.totalKnockouts = FieldValue.increment(multiplier * 1);
      }
    }

    /** Streaks */
    if (flags.didWin === true) {
      metrics.winStreak = FieldValue.increment(multiplier * 1);
      metrics.loseStreak = 0;
    } else if (flags.didLose === true) {
      metrics.winStreak = 0;
      metrics.loseStreak = FieldValue.increment(multiplier * 1);
    }

    return metrics;
  }
}
