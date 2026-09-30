import { connectDatabase } from '../config/db.js';
import { store } from '../services/store.js';

const runSeeder = async () => {
  console.log('🌱 Starting manual database seed script...');
  await connectDatabase();
  await store.initialize();
  const res = await store.resetAndSeed();
  console.log(res.message);
  process.exit(0);
};

runSeeder().catch((err) => {
  console.error('Seeder failed:', err);
  process.exit(1);
});
