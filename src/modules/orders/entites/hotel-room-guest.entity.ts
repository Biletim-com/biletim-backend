import { Entity, Column, JoinColumn, ManyToOne } from 'typeorm';

import { AbstractEntity } from '@app/common/database/postgresql/abstract.entity';

// entites
import { HotelBookingRoom } from './hotel-booking-room.entity';

// enums
import { Gender } from '@app/common/enums';

// types
import { DateISODate } from '@app/common/types';
import { calculateAge } from '@app/common/utils';

@Entity('hotel_booking_room_guests')
export class HotelRoomGuest extends AbstractEntity<HotelRoomGuest> {
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column('varchar')
  gender: Gender;

  @Column('date')
  birthday: DateISODate;

  @JoinColumn()
  @ManyToOne(
    () => HotelBookingRoom,
    (hotelBookingRoom) => hotelBookingRoom.guests,
  )
  room: HotelBookingRoom;

  get age(): number {
    return calculateAge(this.birthday);
  }

  get isChild(): boolean {
    return this.age <= 17;
  }
}
