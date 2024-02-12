import { readJsonDb, updateJsonDb } from '../utils/dbUtils';
import { IUser, UserData } from '../types';
import { User } from '../models/User';

export default class UserService {
  constructor(private jsonDbFilePath: string) {}

  public async get() {
    return await readJsonDb<IUser>(this.jsonDbFilePath);
  }

  public async getById(id: string) {
    const users = await this.get();

    return users.find((user) => user.id === id);
  }

  public async create(userData: UserData) {
    const newUser = new User(userData);
    const users = await this.get();

    users.push(newUser);
    await updateJsonDb(this.jsonDbFilePath, users);

    return newUser;
  }

  public async update(id: string, data: UserData) {
    const users = await this.get();
    const index = users.findIndex((user) => user.id === id);

    if (index >= 0) {
      users[index] = { ...users[index], ...data };
      await updateJsonDb(this.jsonDbFilePath, users);

      return users[index];
    } else {
      return null;
    }
  }

  public async delete(id: string) {
    const users = await this.get();
    const user = users.find((user) => user.id === id);
    const newUsers = users.filter((user) => user.id !== id);

    await updateJsonDb(this.jsonDbFilePath, newUsers);

    return user;
  }
}
