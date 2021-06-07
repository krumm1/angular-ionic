export class Booking {
    constructor(public id: string, public placeId: string, public userId: string, public placeTitle: string, public placeImage: string, public firstName: string, public lastName: string, public guestNumber: Number, public bookedFrom: Date, public bookedTo: Date) { }
}