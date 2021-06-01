import { Injectable } from "@angular/core";
import { Booking } from "./booking.model";

@Injectable({ providedIn: 'root' })
export class BookingService {
    private _bookings: Booking[] = [
        {
            id: 'xyz',
            placeId: 'p1',
            placeTitle: 'Manhattan Mansion',
            guestNumber: 2,
            userId: 'abc'
        },
        {
            id: 'lkj',
            placeId: 'p2',
            placeTitle: 'Lorem Ipsum',
            guestNumber: 3,
            userId: 'ser'
        },
        {
            id: 'rse',
            placeId: 'p3',
            placeTitle: 'Dorem Sit Amet',
            guestNumber: 4,
            userId: 'ccc'
        }
    ];

    get bookings() {
        return [...this._bookings];
    }
}