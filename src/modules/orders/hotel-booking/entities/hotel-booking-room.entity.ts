import { Entity, JoinColumn, Column, ManyToOne, OneToMany } from 'typeorm';

// entities
import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';
import { HotelRoomGuest } from './hotel-room-guest.entity';
import { HotelBookingOrder } from './hotel-booking-order.entity';

@Entity('hotel_booking_rooms')
export class HotelBookingRoom extends AbstractEntity<HotelBookingRoom> {
  @Column()
  name: string;

  @JoinColumn()
  @ManyToOne(
    () => HotelBookingOrder,
    (hotelBookingOrder) => hotelBookingOrder.rooms,
  )
  order: HotelBookingOrder;

  @OneToMany(() => HotelRoomGuest, (hotelRoomGuest) => hotelRoomGuest.room, {
    cascade: ['insert'],
  })
  guests: HotelRoomGuest[];
}
