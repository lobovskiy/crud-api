import fsPromises from 'fs/promises';
import { join } from 'path';
import { createServer } from 'http';
import request from 'supertest';
import App from '../src/App';
import { BASE_URL, JSON_DB_PATH } from '../src/consts';
import { IUser } from '../src/types';
import { mockUserData1 } from '../__mocks__/mocks';

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

describe('positive CRUD operations scenario', () => {
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
