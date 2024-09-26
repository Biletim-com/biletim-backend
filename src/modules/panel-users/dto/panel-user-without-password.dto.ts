import { UUID } from '@app/common/types';
import { PanelUser } from '../panel-user.entity';

export class PanelUserWithoutPasswordDto {
  id: UUID;
  name: string;
  familyName: string;
  email: string;
  phone?: string | null;
  address?: string | null;
  isDeleted: boolean;
  isSuperAdmin: boolean;
  createdAt: Date;
  updatedAt: Date;

  constructor(user: PanelUser) {
    this.id = user.id;
    this.name = user.name;
    this.familyName = user.familyName;
    this.email = user.email;
    this.phone = user.phone;
    this.address = user.address;
    this.isDeleted = user.isDeleted;
    this.isDeleted = user.isSuperAdmin;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
