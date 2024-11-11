import { DateTime, UUID } from '@app/common/types';
import { User } from '@app/modules/users/user.entity';

export class UserWithoutPasswordDto {
  id: UUID;
  name: string;
  familyName: string;
  email: string;
  phone?: Nullable<string>;
  address?: Nullable<string>;
  isVerified: boolean;
  isDeleted: boolean;
  forgotPasswordCode?: Nullable<string>;
  isUsed: boolean;
  createdAt: DateTime;
  updatedAt: DateTime;

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
