export interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export type UserData = Omit<IUser, 'id'>;
