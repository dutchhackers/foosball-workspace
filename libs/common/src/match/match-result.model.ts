import { custom, list, object, serializable } from 'serializr';
// import * as moment from 'moment';
import { FirestoreDocument } from '../models/document';
import { checkFlawlessVictory } from '../utils';
import { stringArrayDeserializer, stringArraySerializer } from '../utils/serializers/string-array.serializer';
import { IFinalScore } from './final-score.type';

export interface IMatchResultInput {
  matchDate?: string;
  playersA: string[];
  playersB: string[];
}

export class MatchResultPlayer {
  @serializable
  id!: string;

  @serializable
  name!: string;

  @serializable
  avatar!: string;
}
export interface IMatchResultInput {
  matchDate?: string;
  finalScore: IFinalScore;
  toto: number;
  homeTeamIds: string[];
  awayTeamIds: string[];
}
export interface IMatchResult {
  creationDate?: string;
  matchDate?: string;
  finalScore: IFinalScore;
  toto: number;
  homeTeamIds: string[];
  awayTeamIds: string[];
  homeTeam: MatchResultPlayer[];
  awayTeam: MatchResultPlayer[];
}

export class MatchResult extends FirestoreDocument implements IMatchResult {
  @serializable
  creationDate!: string;

  @serializable
  matchDate!: string;

  @serializable(custom(stringArraySerializer, stringArrayDeserializer))
  finalScore!: IFinalScore;

  @serializable
  toto!: number;

  @serializable(custom(stringArraySerializer, stringArrayDeserializer))
  homeTeamIds!: string[];

  @serializable(list(object(MatchResultPlayer)))
  homeTeam!: MatchResultPlayer[];

  @serializable(custom(stringArraySerializer, stringArrayDeserializer))
  awayTeamIds!: string[];

  @serializable(list(object(MatchResultPlayer)))
  awayTeam!: MatchResultPlayer[];

  get hasHumiliation(): boolean {
    return checkFlawlessVictory(this.finalScore);
  }

  get hasSuckerPunch(): boolean {
    return this.finalScore[0] === 11 || this.finalScore[1] === 11;
  }

  get winners() {
    switch (this.toto) {
      case 1:
        return this.homeTeamIds;
      case 2:
        return this.awayTeamIds;
    }
    return [];
  }

  get losers() {
    switch (this.toto) {
      case 1:
        return this.awayTeamIds;
      case 2:
        return this.homeTeamIds;
    }
    return [];
  }

  get totalPlayers(): number {
    return [...this.homeTeamIds, ...this.awayTeamIds].length;
  }

  getWinDelta(): number {
    return Math.abs(this.finalScore[0] - this.finalScore[1]);
  }

  getTotalGoalsWith(playerId: string): number {
    if (this.homeTeamIds.indexOf(playerId) >= 0) {
      return this.finalScore[0];
    } else if (this.awayTeamIds.indexOf(playerId) >= 0) {
      return this.finalScore[1];
    }
    return 0;
  }

  getTotalGoalsAgainst(playerId: string): number {
    if (this.homeTeamIds.indexOf(playerId) >= 0) {
      return this.finalScore[1];
    } else if (this.awayTeamIds.indexOf(playerId) >= 0) {
      return this.finalScore[0];
    }
    return 0;
  }

  getTeamPlayerIds(playerId: string): string[] {
    const teamMembers = [];
    if (this.homeTeamIds.indexOf(playerId) >= 0) {
      teamMembers.push(...this.homeTeamIds);
    } else if (this.awayTeamIds.indexOf(playerId) >= 0) {
      teamMembers.push(...this.awayTeamIds);
    }
    return teamMembers.filter(p => p !== playerId);
  }

  getOpponentPlayerIds(playerId: string): string[] {
    if (this.homeTeamIds.indexOf(playerId) >= 0) {
      return this.awayTeamIds;
    } else if (this.awayTeamIds.indexOf(playerId) >= 0) {
      return this.homeTeamIds;
    }
    return [];
  }

  checkPlayerWin(playerId: string) {
    return this.winners.indexOf(playerId) >= 0;
  }

  checkPlayerLose(playerId: string) {
    return this.losers.indexOf(playerId) >= 0;
  }

  checkPlayerFlawlessWin(playerId: string) {
    if (this.hasHumiliation === true) {
      return this.winners.indexOf(playerId) >= 0;
    }
    return false;
  }

  checkPlayerFlawlessLose(playerId: string) {
    if (this.hasHumiliation === true) {
      return this.losers.indexOf(playerId) >= 0;
    }
    return false;
  }

  checkPlayerDidSuckerPunch(playerId: string) {
    if (this.hasSuckerPunch && this.checkPlayerWin(playerId)) {
      return true;
    }
    return false;
  }

  checkPlayerGotSuckerPunched(playerId: string) {
    if (this.hasSuckerPunch && this.checkPlayerLose(playerId)) {
      return true;
    }
    return false;
  }

  debugPrint(): void {
    const homeTeam = this.homeTeam.map((p: any) => p.name);
    const awayTeam = this.awayTeam.map((p: any) => p.name);

    // console.log(
    //   `[${DateTime.fromObject(this.matchDate).format('DD-MM-YYYY-HH:mm')}] ${homeTeam.join(' & ')} VS ${awayTeam.join(
    //     ' & '
    //   )} (${this.finalScore.join(' - ')})`
    // );
  }
}
