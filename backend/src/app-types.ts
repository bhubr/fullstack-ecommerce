export interface IUserDTO {
  email: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser {
  id: number;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export type IUserWithHash = IUser & { passwordHash: string };