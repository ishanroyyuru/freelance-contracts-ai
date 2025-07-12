// tests/auth.test.ts
import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

beforeAll(async () => {
  // Clear child tables first to avoid FK violations:
  await prisma.annotation.deleteMany();
  await prisma.summary.deleteMany();
  await prisma.contract.deleteMany();
  // Now it's safe to delete users:
  await prisma.user.deleteMany();
});

afterAll(async () => {
  await prisma.$disconnect();
});

describe('Auth Endpoints', () => {
  const email = `test${Date.now()}@example.com`;
  const password = 'secret123';
  let token: string;

  it('POST /signup should return 201 + token', async () => {
    const res = await request(app)
      .post('/signup')
      .send({ email, password, name: 'Tester' })
      .expect(201);
    expect(res.body).toHaveProperty('token');
    token = res.body.token;
  });

  it('POST /login should return 201 + token', async () => {
    const res = await request(app)
      .post('/login')
      .send({ email, password })
      .expect(201);
    expect(res.body).toHaveProperty('token');
  });

  it('GET /contracts without token should 401', async () => {
    await request(app).get('/contracts').expect(401);
  });

  it('GET /contracts with token should return 200 + array', async () => {
    const res = await request(app)
      .get('/contracts')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });
});
