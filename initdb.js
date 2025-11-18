import { config } from 'dotenv';
import { resolve } from 'path';
config({ path: resolve(process.cwd(), '.env.local') });
import clientPromise, { getDbName } from './lib/mongodb.js';

async function initDB() {
  try {
    const client = await clientPromise;
    const db = client.db(getDbName());
    
    await db.collection('meals').createIndex({ slug: 1 }, { unique: true });
    
    const collections = await db.listCollections().toArray();
    console.log('MongoDB connection successful!');
    console.log('Available collections:', collections.map(c => c.name));
    console.log('Database is ready. You can now add meals through the app.');
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  } finally {
    process.exit();
  }
}

initDB();