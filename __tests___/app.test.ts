import fsPromises from 'fs/promises';
import { join } from 'path';
import { createServer } from 'http';
import request from 'supertest';
import { v4 } from 'uuid';
import App from '../src/App';
import { BASE_URL, JSON_DB_PATH } from '../src/consts';
import { IUser } from '../src/types';
import {
  mockUserData1,
  mockUserData2,
  mockUserData3,
} from '../__mocks__/mocks';

const jsonDbFilePath = join(__dirname, JSON_DB_PATH);
const app = new App(jsonDbFilePath);
const server = createServer(
  async (req, res) => await app.handleHttpRequest(req, res)
);

beforeAll(async () => {
  await fsPromises.writeFile(jsonDbFilePath, '[]');
});

afterAll(async () => {
  await fsPromises.unlink(jsonDbFilePath);
});

describe('CRUD operations scenario 1', () => {
  let newUser: IUser;

  it('should get an empty array', () => {
    return request(server)
      .get(BASE_URL)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual([]);
      });
  });

  it('should create new user', () => {
    return request(server)
      .post(BASE_URL)
      .send(mockUserData1)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ ...mockUserData1, id: res.body.id });

        newUser = res.body;
      });
  });

  it('should get new user by id', () => {
    return request(server)
      .get(`${BASE_URL}/${newUser.id}`)
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(newUser);
      });
  });

  it('should update new user data', () => {
    const newUsername = 'Chuck Norris';
    newUser.username = newUsername;

    return request(server)
      .put(`${BASE_URL}/${newUser.id}`)
      .send({ username: newUsername })
      .expect(200)
      .then((res) => {
        expect(res.body).toEqual(newUser);
      });
  });

  it('should delete user', () => {
    return request(server).delete(`${BASE_URL}/${newUser.id}`).expect(204);
  });
});

describe('CRUD operations scenario 2', () => {
  let newUser1: IUser;
  let newUser2: IUser;

  it('should create new user', () => {
    return request(server)
      .post(BASE_URL)
      .send(mockUserData2)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ ...mockUserData2, id: res.body.id });

        newUser1 = res.body;
      });
  });

  it('should create another new user', () => {
    return request(server)
      .post(BASE_URL)
      .send(mockUserData3)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ ...mockUserData3, id: res.body.id });

        newUser2 = res.body;
      });
  });

  it('should get an array with two users', () => {
    return request(server)
      .get(BASE_URL)
      .expect(200)
      .then((res) => {
        expect(res.body.length).toEqual(2);
      });
  });

  it('should return 400 for PUT user with invalid data', () => {
    return request(server)
      .put(`${BASE_URL}/${newUser1.id}`)
      .send({ invalidData: false })
      .expect(400)
      .then((res) => {
        expect(res.body.error).toEqual('Bad request');
      });
  });

  it('should delete the first user', () => {
    return request(server).delete(`${BASE_URL}/${newUser1.id}`).expect(204);
  });

  it('should get an array with the second user only', () => {
    return request(server)
      .get(BASE_URL)
      .expect(200)
      .then((res) => {
        expect(res.body.length).toEqual(1);
        expect(res.body[0]).toEqual(newUser2);
      });
  });
});

describe('errors CRUD operations scenario', () => {
  it('should return 501 for unsupported method', () => {
    return request(server).options(BASE_URL).expect(501);
  });

  it('should return 404 for GET invalid resource path', () => {
    return request(server).get('/qwerty').expect(404);
  });

  it('should return 404 for GET non-existent user id', () => {
    return request(server)
      .get(`${BASE_URL}/${v4()}`)
      .expect(404)
      .then((res) => {
        expect(res.body.error).toEqual('Not found');
      });
  });

  it('should return 404 for GET invalid user id', () => {
    return request(server)
      .get(`${BASE_URL}/invalid-user-id`)
      .expect(400)
      .then((res) => {
        expect(res.body.error).toEqual('Bad request');
      });
  });

  it('should return 400 for POST user with invalid data', () => {
    const invalidUserData: Partial<IUser> = {
      username: 'Chuck Norris',
      age: 1,
    };

    return request(server)
      .post(BASE_URL)
      .send(invalidUserData)
      .expect(400)
      .then((res) => {
        expect(res.body.error).toEqual('Bad request');
      });
  });

  it('should return 404 for PUT user with non-existent id', () => {
    return request(server)
      .put(`${BASE_URL}/${v4()}`)
      .send({ username: 'newUsername' })
      .expect(404)
      .then((res) => {
        expect(res.body.error).toEqual('Not found');
      });
  });

  it('should return 404 for DELETE user with non-existent id', () => {
    return request(server).delete(`${BASE_URL}/${v4()}`).expect(404);
  });
});
