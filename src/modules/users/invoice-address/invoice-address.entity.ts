import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';
import { InvoiceType } from '@app/common/enums';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../user.entity';

@Entity('invoice_addresses')
export class InvoiceAddress extends AbstractEntity<InvoiceAddress> {
  @Column('varchar')
  type: InvoiceType;

  // person's or company's name
  @Column()
  name: string;

  // tcNumber or TaxNumber
  @Column()
  identifier: string;

  @Column()
  address: string;

  @Column({ nullable: true })
  taxOffice?: string;

  @ManyToOne(() => User, (user) => user.invoiceAddresses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: User;
}
