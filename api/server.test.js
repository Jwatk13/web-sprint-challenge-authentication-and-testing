// Write your tests here
const db = require('../data/dbConfig');
const request = require('supertest');
const server = require('./server')

test('sanity', () => {
  expect(true).not.toBe(false)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
});
beforeEach(async () => {
  await db('users').truncate()
});
afterAll(async () => {
  await db.destroy()
});

test('is NODE_ENV set correctly?', () => {
  expect(process.env.NODE_ENV).toBe('testing');
});

describe('HTTP endpoints', () => {
  test('POST api/auth/register', async () => {
    let result = await request(server).post('/api/auth/register').send({ username: "Captain America", password: "baz" });
    expect(result.status).toBe(201);
    result = await request(server).post('/api/auth/register').send({ username: "Foo" });
    expect(result.body).toMatchObject({ message: "username and password required" });
  });

  test('POST /login', async () => {
    let result = await request(server).post('/api/auth/login').send({ username: "Captain Marvel", password: "foo" });
    expect(result.body).toMatchObject({ message: 'invalid credentials' });
    result = await request(server).post('/api/auth/login').send({ username: "foobar" });
    expect(result.body).toMatchObject({ message: "username and password required" });
  });

  test('GET /jokes', async () => {
    let result = await request(server).get('/api/jokes');
    expect(result.body).toMatchObject({ message: "token required" });
  });
});
