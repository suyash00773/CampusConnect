import { createApp } from './app.js';
import { ENV } from './config/env.js';
import { connectDatabase } from './config/db.js';
import { store } from './services/store.js';

const startServer = async () => {
  try {
    console.log('🚀 Initializing CampusConnect Backend Engine...');

    // Attempt MongoDB Atlas connection
    await connectDatabase();

    // Initialize data store (seeds realistic data if needed)
    await store.initialize();

    const app = createApp();
    const port = parseInt(ENV.PORT, 10) || 5000;

    app.listen(port, () => {
      console.log(`\n======================================================`);
      console.log(`🎓 CampusConnect Backend running on: http://localhost:${port}`);
      console.log(`📡 Health Check: http://localhost:${port}/api/health`);
      console.log(`🔐 Default Admin: admin@campusconnect.edu | Admin@CampusConnect2026`);
      console.log(`======================================================\n`);
    });
  } catch (error) {
    console.error('Fatal error starting CampusConnect server:', error);
    process.exit(1);
  }
};

startServer();
