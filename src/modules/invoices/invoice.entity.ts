import { Column, Entity, OneToOne } from 'typeorm';

// entities
import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';
import { Order } from '../orders/order.entity';

// enums
import { InvoiceType } from '@app/common/enums';

@Entity('invoices')
export class Invoice extends AbstractEntity<Invoice> {
  @Column('varchar')
  type: InvoiceType;

  @Column('varchar', { nullable: true })
  pnr?: Nullable<string>;

  @Column()
  recipientName: string;

  @Column()
  identifier: string;

  @Column()
  address: string;

  @Column('varchar', { nullable: true })
  taxOffice?: Nullable<string>;

  @Column()
  phoneNumber: string;

  @Column()
  email: string;

  @OneToOne(() => Order, (order) => order.invoice)
  order: Order;
}
