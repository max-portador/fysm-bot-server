import { ObjectId } from 'mongoose';
import { UserRole } from '../user.model';

export interface CreateUserDto {
  tgUsername: string;
  isActive: boolean;
  tgId?: number;
  expirationMonths?: number;
  role: UserRole;
  equalityMode?: boolean;
  sendAlgPhoto?: boolean;
}

export interface UpdateUserDto extends CreateUserDto {
  _id: ObjectId;
}
