import { Firestore } from 'firebase-admin/firestore';
import { Seeder } from '../types/seeder.interface';

interface Player {
  id: string;
  name: string;
  displayName?: string;
  avatar: string;
  slackId: string | null;
  active: boolean;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

export class PlayerSeeder implements Seeder<Player> {
  async seed(db: Firestore, users: Player[]): Promise<void> {
    const batch = db.batch();

    for (const user of users) {
      const ref = db.collection('users').doc(user.id);
      batch.set(ref, {
        ...user,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    }

    await batch.commit();
  }

  async clear(db: Firestore): Promise<void> {
    const snapshot = await db.collection('users').get();
    const batch = db.batch();

    snapshot.docs.forEach(doc => {
      batch.delete(doc.ref);
    });

    await batch.commit();
  }
}
