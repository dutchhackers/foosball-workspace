import { Injectable } from '@nestjs/common';
import { DataService } from '@foosball/data';

@Injectable()
export class PlayerService {
  constructor(private readonly data: DataService) {}

  async test() {
    return this.getData();
  }

  private async getData() {
    const snapshotItems = await this.data
      .collection('players')
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
}
