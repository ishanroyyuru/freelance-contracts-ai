import request from 'supertest';
import app from '../src/app';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('Contracts CRUD', () => {
  let token: string;
  let contractId: string;
  const email = `user${Date.now()}@ex.com`;
  const password = 'pw12345';

  beforeAll(async () => {
    // reset DB
    await prisma.annotation.deleteMany();
    await prisma.summary.deleteMany();
    await prisma.contract.deleteMany();
    await prisma.user.deleteMany();

    // signup & grab token
    const res = await request(app)
      .post('/signup')
      .send({ email, password, name: 'Test' });
    token = res.body.token;
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('POST /contracts → 201 + new contract', async () => {
    const res = await request(app)
      .post('/contracts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'C1', text: 'T1', status: 'draft' })
      .expect(201);
    expect(res.body).toMatchObject({ title: 'C1', text: 'T1' });
    contractId = res.body.id;
  });

  it('GET /contracts → 200 + array containing our contract', async () => {
    const res = await request(app)
      .get('/contracts')
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.some((c: any) => c.id === contractId)).toBe(true);
  });

  it('GET /contracts/:id → 200 + single contract', async () => {
    const res = await request(app)
      .get(`/contracts/${contractId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body.id).toBe(contractId);
  });

  it('PUT /contracts/:id → 200 + message', async () => {
    const res = await request(app)
      .put(`/contracts/${contractId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Updated' })
      .expect(200);
    expect(res.body).toHaveProperty('message', 'Updated');
  });

  it('DELETE /contracts/:id → 200 + message', async () => {
    const res = await request(app)
      .delete(`/contracts/${contractId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200);
    expect(res.body).toHaveProperty('message', 'Deleted');
  });
});
