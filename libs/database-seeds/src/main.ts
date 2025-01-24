import { initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { PlayerSeeder } from './lib/seeders/player.seeder';
import { MatchSeeder } from './lib/seeders/match.seeder';
import { loadJsonData } from './lib/utils/file-loader';

async function main() {
  if (!process.env.FIREBASE_PROJECT_ID) {
    throw new Error('FIREBASE_PROJECT_ID environment variable is not set');
  }

  initializeApp({
    projectId: process.env.FIREBASE_PROJECT_ID,
  });

  const db = getFirestore();

  // Configure Firestore to use emulator
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    console.log('Using Firestore Emulator:', process.env.FIRESTORE_EMULATOR_HOST);
    db.settings({
      host: process.env.FIRESTORE_EMULATOR_HOST,
      ssl: false,
    });
  }

  try {
    const playerSeeder = new PlayerSeeder();
    const matchSeeder = new MatchSeeder();

    // Seed players first
    const playerData = await loadJsonData<{ players: any[] }>('players.json');
    await playerSeeder.seed(db, playerData.players);

    // Seed matches next
    const matchData = await loadJsonData<{ matches: any[] }>('matches.json');
    await matchSeeder.seed(db, matchData.matches);

    console.log('✅ Seeding completed');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

main();
