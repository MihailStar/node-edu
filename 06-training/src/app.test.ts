import dotenv from 'dotenv';
import mongoose from 'mongoose';
// eslint-disable-next-line import/no-extraneous-dependencies
import supertest from 'supertest';
import initializeApp from './app';

const { DB_URL } = <{ DB_URL: string }>dotenv.config().parsed;

const app = initializeApp();
const request = supertest(app);

let id = '';
let idToDelete = '';
let login = '';
let password = '';
let response;

/** @returns String 24 chars long */
function getRandomId(): string {
  return Math.random().toString().slice(2, 14).repeat(2);
}

beforeAll(async () => {
  await mongoose.connect(DB_URL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

beforeEach(() => {
  id = '';
  idToDelete = '';
  login = '';
  password = '';
  response = null;
});

afterAll(async () => {
  await mongoose.disconnect();
});

afterEach(async () => {
  if (idToDelete === '') {
    return;
  }

  await request.delete('/api/v1/user/').send({ id: idToDelete });
});

describe('Create', () => {
  test('POST /api/v1/user/ {"login":"not","pass":"not"}', async () => {
    response = await request.post('/api/v1/user/').send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toStrictEqual(
      expect.stringContaining('Login required')
    );
    expect(response.body.message).toStrictEqual(
      expect.stringContaining('Password required')
    );
  });

  test('POST /api/v1/user/ {"login":"not","pass":"notValid"}', async () => {
    password = getRandomId().slice(24 - 7);
    response = await request.post('/api/v1/user/').send({ password });
    expect(response.status).toBe(400);
    expect(response.body.message).toStrictEqual(
      expect.stringContaining('Login required')
    );
    expect(response.body.message).toStrictEqual(
      expect.stringContaining('Password length from 8 chars')
    );

    password = getRandomId().slice(24 - 21);
    response = await request.post('/api/v1/user/').send({ password });
    expect(response.status).toBe(400);
    expect(response.body.message).toStrictEqual(
      expect.stringContaining('Login required')
    );
    expect(response.body.message).toStrictEqual(
      expect.stringContaining('Password length to 20 chars')
    );
  });

  test('POST /api/v1/user/ {"login":"not","pass":"valid"}', async () => {
    password = getRandomId().slice(24 - 20);
    response = await request.post('/api/v1/user/').send({ password });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Login required');
  });

  test('POST /api/v1/user/ {"login":"notValid","pass":"not"}', async () => {
    login = getRandomId().slice(24 - 3);
    response = await request.post('/api/v1/user/').send({ login });
    expect(response.status).toBe(400);
    expect(response.body.message).toStrictEqual(
      expect.stringContaining('Login length from 4 chars')
    );
    expect(response.body.message).toStrictEqual(
      expect.stringContaining('Password required')
    );

    login = getRandomId().slice(24 - 21);
    response = await request.post('/api/v1/user/').send({ login });
    expect(response.status).toBe(400);
    expect(response.body.message).toStrictEqual(
      expect.stringContaining('Login length to 20 chars')
    );
    expect(response.body.message).toStrictEqual(
      expect.stringContaining('Password required')
    );
  });

  test('POST /api/v1/user/ {"login":"notValid","pass":"notValid"}', async () => {
    login = getRandomId().slice(24 - 3);
    password = getRandomId().slice(24 - 7);
    response = await request.post('/api/v1/user/').send({ login, password });
    expect(response.status).toBe(400);
    expect(response.body.message).toStrictEqual(
      expect.stringContaining('Login length from 4 chars')
    );
    expect(response.body.message).toStrictEqual(
      expect.stringContaining('Password length from 8 chars')
    );

    login = getRandomId().slice(24 - 3);
    password = getRandomId().slice(24 - 21);
    response = await request.post('/api/v1/user/').send({ login, password });
    expect(response.status).toBe(400);
    expect(response.body.message).toStrictEqual(
      expect.stringContaining('Login length from 4 chars')
    );
    expect(response.body.message).toStrictEqual(
      expect.stringContaining('Password length to 20 chars')
    );

    login = getRandomId().slice(24 - 21);
    password = getRandomId().slice(24 - 7);
    response = await request.post('/api/v1/user/').send({ login, password });
    expect(response.status).toBe(400);
    expect(response.body.message).toStrictEqual(
      expect.stringContaining('Login length to 20 chars')
    );
    expect(response.body.message).toStrictEqual(
      expect.stringContaining('Password length from 8 chars')
    );

    login = getRandomId().slice(24 - 21);
    password = getRandomId().slice(24 - 21);
    response = await request.post('/api/v1/user/').send({ login, password });
    expect(response.status).toBe(400);
    expect(response.body.message).toStrictEqual(
      expect.stringContaining('Login length to 20 chars')
    );
    expect(response.body.message).toStrictEqual(
      expect.stringContaining('Password length to 20 chars')
    );
  });

  test('POST /api/v1/user/ {"login":"notValid","pass":"valid"}', async () => {
    login = getRandomId().slice(24 - 3);
    password = getRandomId().slice(24 - 20);
    response = await request.post('/api/v1/user/').send({ login, password });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Login length from 4 chars');

    login = getRandomId().slice(24 - 21);
    password = getRandomId().slice(24 - 20);
    response = await request.post('/api/v1/user/').send({ login, password });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Login length to 20 chars');
  });

  test('POST /api/v1/user/ {"login":"valid","pass":"not"}', async () => {
    login = getRandomId().slice(24 - 20);
    response = await request.post('/api/v1/user/').send({ login });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Password required');
  });

  test('POST /api/v1/user/ {"login":"valid","pass":"notValid"}', async () => {
    login = getRandomId().slice(24 - 20);
    password = getRandomId().slice(24 - 7);
    response = await request.post('/api/v1/user/').send({ login, password });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Password length from 8 chars');

    login = getRandomId().slice(24 - 20);
    password = getRandomId().slice(24 - 21);
    response = await request.post('/api/v1/user/').send({ login, password });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Password length to 20 chars');
  });

  test('POST /api/v1/user/ {"login":"valid","pass":"valid"}', async () => {
    login = getRandomId().slice(24 - 20);
    password = getRandomId().slice(24 - 20);
    response = await request.post('/api/v1/user/').send({ login, password });

    const {
      body: { _id },
    } = response;

    idToDelete = _id;

    expect(response.status).toBe(200);
    expect(response.body.login).toBe(login);
    expect(response.body.password).toBe(password);
  });

  test('POST /api/v1/user/ {"login":"exists","pass":"true"}', async () => {
    login = getRandomId().slice(24 - 20);
    password = getRandomId().slice(24 - 20);
    response = await request.post('/api/v1/user/').send({ login, password });

    const {
      body: { _id },
    } = response;

    idToDelete = _id;

    expect(response.status).toBe(200);
    expect(response.body.login).toBe(login);
    expect(response.body.password).toBe(password);

    password = getRandomId().slice(24 - 20);
    response = await request.post('/api/v1/user/').send({ login, password });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Login exists');
  });
});

describe('Read', () => {
  test('GET /api/v1/user/', async () => {
    response = await request.get('/api/v1/user/');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  test('GET /api/v1/user/not/', async () => {
    id = getRandomId();
    response = await request.get(`/api/v1/user/${id}/`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User is not found');
  });

  test('GET /api/v1/user/ {"id":"not"}', async () => {
    id = getRandomId();
    response = await request.get('/api/v1/user/').send({ id });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User is not found');
  });

  test('GET /api/v1/user/notValid/', async () => {
    id = getRandomId().slice(24 - 1);
    response = await request.get(`/api/v1/user/${id}/`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Id is not valid');
  });

  test('GET /api/v1/user/ {"id":"notValid"}', async () => {
    id = getRandomId().slice(24 - 1);
    response = await request.get('/api/v1/user/').send({ id });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Id is not valid');
  });

  test('GET /api/v1/user/valid/', async () => {
    login = getRandomId().slice(4);
    password = getRandomId().slice(4);
    response = await request.post('/api/v1/user/').send({ login, password });

    const {
      body: { _id },
    } = response;

    idToDelete = _id;

    expect(response.status).toBe(200);
    expect(response.body.login).toBe(login);
    expect(response.body.password).toBe(password);

    response = await request.get(`/api/v1/user/${_id}/`);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ _id, login, password });
  });

  test('GET /api/v1/user/ {"id":"valid"}', async () => {
    login = getRandomId().slice(4);
    password = getRandomId().slice(4);
    response = await request.post('/api/v1/user/').send({ login, password });

    const {
      body: { _id },
    } = response;

    idToDelete = _id;

    expect(response.status).toBe(200);
    expect(response.body.login).toBe(login);
    expect(response.body.password).toBe(password);

    response = await request.get('/api/v1/user/').send({ id: _id });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ _id, login, password });
  });
});

describe('Update', () => {
  test('PATCH /api/v1/user/ {"id":"not","pass":"not"}', async () => {
    response = await request.patch('/api/v1/user/').send({});
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Id is not valid');
  });

  test('PATCH /api/v1/user/ {"id":"not","pass":"notValid"}', async () => {
    password = getRandomId().slice(24 - 7);
    response = await request.patch('/api/v1/user/').send({ password });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Id is not valid');

    password = getRandomId().slice(24 - 21);
    response = await request.patch('/api/v1/user/').send({ password });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Id is not valid');
  });

  test('PATCH /api/v1/user/ {"id":"not","pass":"valid"}', async () => {
    password = getRandomId().slice(24 - 20);
    response = await request.patch('/api/v1/user/').send({ password });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Id is not valid');
  });

  test('PATCH /api/v1/user/ {"id":"notValid","pass":"not"}', async () => {
    id = getRandomId().slice(24 - 1);
    response = await request.patch('/api/v1/user/').send({ id });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Id is not valid');
  });

  test('PATCH /api/v1/user/ {"id":"notValid","pass":"notValid"}', async () => {
    id = getRandomId().slice(24 - 1);
    password = getRandomId().slice(24 - 7);
    response = await request.patch('/api/v1/user/').send({ id, password });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Id is not valid');

    id = getRandomId().slice(24 - 1);
    password = getRandomId().slice(24 - 21);
    response = await request.patch('/api/v1/user/').send({ id, password });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Id is not valid');
  });

  test('PATCH /api/v1/user/ {"id":"notValid","pass":"valid"}', async () => {
    id = getRandomId().slice(24 - 1);
    password = getRandomId().slice(24 - 20);
    response = await request.patch('/api/v1/user/').send({ id, password });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Id is not valid');
  });

  test('PATCH /api/v1/user/ {"id":"valid","pass":"not"}', async () => {
    login = getRandomId().slice(24 - 20);
    password = getRandomId().slice(24 - 20);
    response = await request.post('/api/v1/user/').send({ login, password });

    const {
      body: { _id },
    } = response;

    idToDelete = _id;

    expect(response.status).toBe(200);
    expect(response.body.login).toBe(login);
    expect(response.body.password).toBe(password);

    response = await request.patch('/api/v1/user/').send({ id: _id });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Password required');
  });

  test('PATCH /api/v1/user/ {"id":"valid","pass":"notValid"}', async () => {
    login = getRandomId().slice(24 - 20);
    password = getRandomId().slice(24 - 20);
    response = await request.post('/api/v1/user/').send({ login, password });

    const {
      body: { _id },
    } = response;

    idToDelete = _id;

    expect(response.status).toBe(200);
    expect(response.body.login).toBe(login);
    expect(response.body.password).toBe(password);

    password = getRandomId().slice(24 - 7);
    response = await request.patch('/api/v1/user/').send({ id: _id, password });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Password length from 8 chars');

    password = getRandomId().slice(24 - 21);
    response = await request.patch('/api/v1/user/').send({ id: _id, password });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Password length to 20 chars');
  });

  test('PATCH /api/v1/user/ {"id":"valid","pass":"valid"}', async () => {
    login = getRandomId().slice(24 - 20);
    password = getRandomId().slice(24 - 20);
    response = await request.post('/api/v1/user/').send({ login, password });

    const {
      body: { _id },
    } = response;

    idToDelete = _id;

    expect(response.status).toBe(200);
    expect(response.body.login).toBe(login);
    expect(response.body.password).toBe(password);

    password = getRandomId().slice(24 - 20);
    response = await request.patch('/api/v1/user/').send({ id: _id, password });
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ _id, login, password });
  });
});

describe('Delete', () => {
  test('DELETE /api/v1/user/not/', async () => {
    id = getRandomId();
    response = await request.delete(`/api/v1/user/${id}/`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User is not found');
  });

  test('DELETE /api/v1/user/ {"id":"not"}', async () => {
    id = getRandomId();
    response = await request.delete('/api/v1/user/').send({ id });
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User is not found');
  });

  test('DELETE /api/v1/user/notValid/', async () => {
    id = getRandomId().slice(24 - 1);
    response = await request.delete(`/api/v1/user/${id}/`);
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Id is not valid');
  });

  test('DELETE /api/v1/user/ {"id":"notValid"}', async () => {
    id = getRandomId().slice(24 - 1);
    response = await request.delete('/api/v1/user/').send({ id });
    expect(response.status).toBe(400);
    expect(response.body.message).toBe('Id is not valid');
  });

  test('DELETE /api/v1/user/valid/', async () => {
    login = getRandomId().slice(4);
    password = getRandomId().slice(4);

    const {
      body: { _id },
    } = await request.post('/api/v1/user/').send({ login, password });

    response = await request.delete(`/api/v1/user/${_id}/`);
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ _id, login, password });
  });

  test('DELETE /api/v1/user/ {"id":"valid"}', async () => {
    login = getRandomId().slice(4);
    password = getRandomId().slice(4);

    const {
      body: { _id },
    } = await request.post('/api/v1/user/').send({ login, password });

    response = await request.delete('/api/v1/user/').send({ id: _id });
    expect(response.status).toBe(200);
    expect(response.body).toStrictEqual({ _id, login, password });
  });
});

describe('Other', () => {
  test('POST /random/', async () => {
    id = getRandomId();
    response = await request.post(`/${id}/`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Not found');
  });

  test('GET /random/', async () => {
    id = getRandomId();
    response = await request.get(`/${id}/`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Not found');
  });

  test('PUT /random/', async () => {
    id = getRandomId();
    response = await request.put(`/${id}/`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Not found');
  });

  test('DELETE /random/', async () => {
    id = getRandomId();
    response = await request.delete(`/${id}/`);
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('Not found');
  });
});
