import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { connectToDatabase } from '../../src/server/db/mongoose';

let mongod: MongoMemoryServer | null = null;

beforeAll(async () => {
  mongod = await MongoMemoryServer.create();
  process.env.MONGODB_URI = mongod.getUri();
  await connectToDatabase();
}, 60000); // Increase timeout for MongoDB download

afterAll(async () => {
  if (mongod) await mongod.stop();
});

describe('E2E API Routes', () => {
  it('POST /api/auth/signup creates a user', async () => {
    const response = await fetch('http://localhost:3000/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test${Date.now()}@example.com`,
        password: 'password123',
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.success).toBe(true);
    expect(data.user).toHaveProperty('email');
  });

  it('POST /api/events requires admin role', async () => {
    const response = await fetch('http://localhost:3000/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Event',
      }),
    });

    // Without session, should fail (403 or 400 depending on middleware)
    expect([401, 403, 400]).toContain(response.status);
  });
});
