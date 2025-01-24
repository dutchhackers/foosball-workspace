import { IMatchResult } from '@foosball/common';
import { Firestore } from 'firebase-admin/firestore';
import { Seeder } from '../types/seeder.interface';

interface Match extends IMatchResult {
  _members: string[];
}

export class MatchSeeder implements Seeder<Match> {
  async seed(db: Firestore, matches: IMatchResult[]): Promise<void> {
    const batch = db.batch();

    for (const match of matches) {
      const matchId = db.collection('matches').doc().id;
      const ref = db.collection('matches').doc(matchId);
      batch.set(ref, {
        ...match,
        id: matchId,
        _members: [...match.homeTeamIds, ...match.awayTeamIds],
      });
    }

    await batch.commit();
  }

  async clear(db: Firestore): Promise<void> {
    const snapshot = await db.collection('matches').get();
    const batch = db.batch();

    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }
}
