import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';
import { InvoiceType } from '@app/common/enums';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../user.entity';

@Entity('invoice_addresses')
export class InvoiceAddress extends AbstractEntity<InvoiceAddress> {
  @Column('varchar')
  type: InvoiceType;

  @Column({ nullable: true })
  fullName?: string;

  @Column({ nullable: true })
  identifier?: string;

  @Column({ nullable: true })
  country?: string;

  @Column({ nullable: true })
  city?: string;

  @Column({ nullable: true })
  district?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  postalCode?: string;

  @Column({ nullable: true })
  companyName?: string;

  @Column({ nullable: true, default: false })
  isPersonalCompany?: boolean;

  @Column({ nullable: true })
  taxOffice?: string;

  @Column({ nullable: true })
  taxNumber?: string;

  @ManyToOne(() => User, (user) => user.invoiceAddresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
