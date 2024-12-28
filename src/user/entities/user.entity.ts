import { Exclude } from 'class-transformer';

export class User {
  id: number;
  email: string;
  name: string;

  @Exclude()
  password: string;

  @Exclude()
  createdAt: Date;

  @Exclude()
  updatedAt: Date;
}
