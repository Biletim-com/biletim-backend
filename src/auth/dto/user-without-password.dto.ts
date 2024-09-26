import { UUID } from '@app/common/types';
import { User } from '@app/modules/users/user.entity';

export class UserWithoutPasswordDto {
  id: UUID;
  name: string;
  familyName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  isVerified: boolean;
  isDeleted: boolean;
  forgotPasswordCode?: string | null;
  isUsed: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.familyName = user.familyName;
    this.email = user.email;
    this.phone = user.phone;
    this.address = user.address;
    this.isVerified = user.isVerified;
    this.isDeleted = user.isDeleted;
    this.forgotPasswordCode = user.forgotPasswordCode;
    this.isUsed = user.isUsed;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
