import { v4 } from 'uuid';
import { IUser, UserData } from '../types';

export class User implements IUser {
  public id: string;

  public username: string;

  public age: number;

  public hobbies: string[];

  constructor(userData: UserData) {
    this.id = v4();
    this.username = userData.username;
    this.age = userData.age;
    this.hobbies = userData.hobbies;
  }
}
