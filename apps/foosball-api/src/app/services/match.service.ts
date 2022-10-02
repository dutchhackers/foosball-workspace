import { Injectable } from '@nestjs/common';
import { DataService } from '@foosball/api/data';

@Injectable()
export class MatchService {
  constructor(private readonly data: DataService) {}

  async test() {
    return this.getData();
  }

  private async getData() {
    const snapshotItems = await this.data.collection('matches').orderBy('matchDate', 'desc').limitToLast(5).get();
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
