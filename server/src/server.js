import dotenv from 'dotenv';
import { connectDatabase } from './config/db.js';
import { createApp } from './app.js';

dotenv.config();

const startServer = async () => {
  await connectDatabase();

  const app = createApp();
  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

startServer().catch((error) => {
  console.error(error);
  process.exit(1);
});
