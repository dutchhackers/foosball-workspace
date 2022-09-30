import { Injectable } from '@nestjs/common';
import { DataService } from '@foosball/data';
import { Player } from '../models/player';

const PLAYERS_COLLECTION = 'players';

@Injectable()
export class PlayerService {
  constructor(private readonly data: DataService) {}

  async getPlayerBySlackId(slackId: string): Promise<Player> {
    const query = this.data.collection(PLAYERS_COLLECTION).where('slackId', '==', slackId).limit(1);

    const snapshot = await query.get();
    const data = await this.wrapAll(snapshot);
    if (data.length) {
      return data[0];
    }
    throw new Error('player not found');
  }

  async test() {
    return this.getData();
  }

  private async getData() {
    const snapshotItems = await this.data
      .collection(PLAYERS_COLLECTION)
      // .orderBy('createdAt', 'desc')
      // .limitToLast(5)
      .get();
    if (!snapshotItems.size) {
      return [];
    }
    return snapshotItems.docs.map(snapshot => this.map(snapshot.data()));
  }

  private map(data: FirebaseFirestore.DocumentData) {
    return {
      ...data,
      id: 1,
      // createdAt: FirestoreTimestampToDate(data.createdAt),
      // startedAt: FirestoreTimestampToDate(data.startedAt),
      // closedAt: FirestoreTimestampToDate(data.closedAt),
    };
  }

  private wrapAll(snapshot: FirebaseFirestore.QuerySnapshot): Player[] {
    const docs: Player[] = [];
    for (const doc of snapshot.docs) {
      docs.push(<Player>doc.data());
    }
    return docs;
  }
}
