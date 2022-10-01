import { FirestoreDocument } from './document';
import { serializable, custom } from 'serializr';
import { serializeFunction, deserializeFunctionIgnoreNull, numberMetric } from './serializers/common.serializer';

const DEFAULT_AVATAR_URL = 'https://picsum.photos/200?grayscale&blur=2';

export interface IPlayer {
  id: string;
  name: string;
  nickname?: string;
  avatar: string;
  slackId?: string;
  status?: string;
  quote?: string;
  displayName?: string;

  /**  player stats*/
  totalMatches?: number;
  totalWins?: number;
  totalFlawlessVictories?: number;
  totalLosses?: number;
  totalHumiliations?: number;
  totalSuckerpunches?: number;
  totalKnockouts?: number;
  dateLastMatch?: string;
  dateLastWin?: string;
  dateLastFlawlessVictory?: string;
  dateLastLose?: string;
  dateLastHumiliation?: string;

  winStreak?: number;
  highestWinStreak?: number;
  loseStreak?: number;
  highestLoseStreak?: number;

  getDisplayName(): string;
}

export class Player extends FirestoreDocument implements IPlayer {
  @serializable
  id!: string;

  @serializable
  name!: string;

  @serializable
  nickname?: string;

  @serializable(custom(serializeFunction, deserializeFunctionIgnoreNull))
  avatar: string = DEFAULT_AVATAR_URL;

  @serializable
  slackId?: string;

  @serializable
  status?: string;

  @serializable
  quote?: string;

  @serializable
  displayName?: string;

  /**  player stats*/
  @serializable(numberMetric())
  totalMatches: number = 0;

  @serializable(numberMetric())
  totalWins: number = 0;

  @serializable(numberMetric())
  totalFlawlessVictories: number = 0;

  @serializable(numberMetric())
  totalLosses: number = 0;

  @serializable(numberMetric())
  totalHumiliations: number = 0;

  @serializable(numberMetric())
  totalSuckerpunches: number = 0;

  @serializable(numberMetric())
  totalKnockouts: number = 0;

  @serializable
  dateLastMatch?: string;

  @serializable
  dateLastWin?: string;

  @serializable
  dateLastFlawlessVictory?: string;

  @serializable
  dateLastLose?: string;

  @serializable
  dateLastHumiliation?: string;

  @serializable(numberMetric())
  winStreak: number = 0;

  @serializable(numberMetric())
  highestWinStreak: number = 0;

  @serializable(numberMetric())
  loseStreak: number = 0;

  @serializable(numberMetric())
  highestLoseStreak: number = 0;

  getDisplayName(): string {
    return this.displayName || this.name;
  }

  currentStreakText(): string {
    if (this.winStreak > this.loseStreak) {
      return this.winStreak + ' wins';
    } else if (this.winStreak < this.loseStreak) {
      return this.loseStreak + ' defeats';
    }
    return '';
  }
}
