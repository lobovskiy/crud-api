export type AtLeastOnePropOf<
  T,
  U = { [K in keyof T]: Pick<T, K> },
> = Partial<T> & U[keyof U];

export interface IUser {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export type UserData = Omit<IUser, 'id'>;
