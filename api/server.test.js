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
  describe('[POST] /api/auth/register', () => {
    test('[1] status when new user created', async () => {
      let result = await request(server).post('/api/auth/register').send({ username: "Captain America", password: "baz" });
      expect(result.status).toBe(201);
    });
    test('[2] error message if password missing', async () => {
      let result = await request(server).post('/api/auth/register').send({ username: "Foo" });
      expect(result.body).toMatchObject({ message: "username and password required" });
    });
  });
  describe('[POST] /api/auth/login', () => {
    test('[1] error message for invalid credentials', async () => {
      let result = await request(server).post('/api/auth/login').send({ username: "Captain Marvel", password: "foo" });
      expect(result.body).toMatchObject({ message: 'invalid credentials' });
    });
    test('[2] error message if username is missing', async () => {
      let result = await request(server).post('/api/auth/login').send({ password: "foobar" });
      expect(result.body).toMatchObject({ message: "username and password required" });
    });
  });
  describe('[GET] /api/jokes', () => {
    test('[1] error if no token received', async () => {
      let result = await request(server).get('/api/jokes');
      expect(result.body).toMatchObject({ message: "token required" });
    });
    test('[2]', async () => {
      let result = await request(server).get('/api/jokes').set({authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWJqZWN0IjoxLCJ1c2VybmFtZSI6IkNhcHRhaW4gTWFydmVsIiwiaWF0IjoxNjU5MzkyNzM0LCJleHAiOjE2NTk0NzkxMzR9.V0KKEA9IRFFL9RHfRL-PvJyK31mi8swAFBpYjRMQVZI'});
      expect(result.body).toHaveLength(3)
    });
  });
});
