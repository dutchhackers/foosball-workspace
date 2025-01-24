import { connectFirestore, IMatchResult, IPlayerStats, PlayerService, StatsUtils } from '@foosball/common';
import { logger, setGlobalOptions } from 'firebase-functions/v2';
import { onRequest } from 'firebase-functions/v2/https';

const DEFAULT_REGION = 'europe-west1';
// locate all functions closest to users
setGlobalOptions({ region: DEFAULT_REGION });

interface SyncPlayerStatsRequest {
  playerId: string;
}

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

interface ResponseObject<T> {
  success: boolean;
  data?: T;
}

export const syncPlayerStats = onRequest(async (req, res) => {
  const stats: SyncPlayerStatsRequest = req.body;
  logger.info('Sync player stats', { playerId: stats.playerId });

  const updatedPlayerStats = await execSyncPlayerStats(stats.playerId);

  const response: ResponseObject<IPlayerStats> = {
    success: true,
    data: updatedPlayerStats,
  };

  res.status(200).json(response);
});

function getDefaultStartDate(): string {
  const date = new Date();
  date.setFullYear(date.getFullYear() - 1);
  return date.toISOString();
}

async function getPlayerMatches(
  playerId: string,
  db: FirebaseFirestore.Firestore,
  options?: {
    maxSize?: number;
    startDate?: string;
  }
) {
  const { maxSize = 10, startDate = getDefaultStartDate() } = options || {};

  const query = db
    .collection('matches')
    .where('_members', 'array-contains', playerId)
    .orderBy('matchDate', 'desc')
    .where('matchDate', '<=', startDate)
    .limit(maxSize);

  return query.get();
}

async function execSyncPlayerStats(playerId: string): Promise<IPlayerStats> {
  const db = connectFirestore();
  const playerService = new PlayerService();
  const player = await playerService.getPlayer(playerId);
  logger.info('Player found', { player });
  const matches = await getPlayerMatches(playerId, db, { maxSize: 10 });

  logger.info('Found matches', { count: matches.size });

  const playerStats = initializePlayerStats();

  matches.forEach(matchSnapshot => {
    const match = matchSnapshot.data() as IMatchResult;
    const entityMatchResult = StatsUtils.calculatePlayerMatchResult(playerId, match);

    StatsUtils.calculateUpdatedPlayerStats(playerStats, entityMatchResult);
  });

  return playerStats;
}

function initializePlayerStats(): IPlayerStats {
  return {
    totalMatches: 0,
    totalWins: 0,
    totalFlawlessVictories: 0,
    totalLosses: 0,
    totalHumiliations: 0,
    totalSuckerpunches: 0,
    totalKnockouts: 0,
    dateLastMatch: undefined,
    dateLastWin: undefined,
    dateLastFlawlessVictory: undefined,
    dateLastLose: undefined,
    dateLastHumiliation: undefined,
    winStreak: 0,
    highestWinStreak: 0,
    loseStreak: 0,
    highestLoseStreak: 0,
  };
}
