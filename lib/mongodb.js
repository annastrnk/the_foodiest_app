import { MongoClient } from 'mongodb';
import { config } from 'dotenv';
import { resolve } from 'path';

if (!process.env.MONGODB_URI && typeof window === 'undefined') {
  config({ path: resolve(process.cwd(), '.env.local') });
}

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local');
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise;

if (process.env.NODE_ENV === 'development') {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect();
  }
  clientPromise = global._mongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export default clientPromise;

export function getDbName() {
  return process.env.MONGODB_DB_NAME || 'meals';
}

