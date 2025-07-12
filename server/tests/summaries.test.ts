import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Summaries CRUD', () => {
  let token: string;
  let contractId: string;
  let summaryId: string;

  beforeAll(async () => {
    // reset DB
    await prisma.annotation.deleteMany();
    await prisma.summary.deleteMany();
    await prisma.contract.deleteMany();
    await prisma.user.deleteMany();

    // signup & contract
    const email = `sum${Date.now()}@ex.com`;
    const pw = 'pw';
    const signup = await request(app)
      .post('/signup')
      .send({ email, password: pw, name: 'S' });
    token = signup.body.token;

    const contract = await request(app)
      .post('/contracts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'C', text: 'Hello world', status: 'draft' });
    contractId = contract.body.id;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /contracts/:id/summaries → 201 + summary', async () => {
    const res = await request(app)
      .post(`/contracts/${contractId}/summaries`)
      .set('Authorization', `Bearer ${token}`)
      .send({ originalText: 'Hello world' })
      .expect(201);
    expect(res.body).toHaveProperty('summaryText');
    summaryId = res.body.id;
  });

  it('GET /contracts/:id/summaries → 200 + array', async () => {
    const res = await request(app)
      .get(`/contracts/${contractId}/summaries`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('DELETE /contracts/:id/summaries/:sid → 200 + message', async () => {
    const res = await request(app)
      .delete(`/contracts/${contractId}/summaries/${summaryId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty('message', 'Summary deleted');
  });
});
