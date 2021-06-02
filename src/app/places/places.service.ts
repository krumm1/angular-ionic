import { Injectable } from '@angular/core';
import { Place } from './place.model';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  private _places: Place[] = [
    new Place('p1', 'Manhattan Mansion', 'In the heart of New York City.', 'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg', 149.99, new Date('01-01-2019'), new Date('01-12-2019')),
    new Place('p2', 'L\'Amour Toujours', 'A romantic place in Paris', 'https://i1.sndcdn.com/artworks-000133489765-rxqs2w-t500x500.jpg', 189.99, new Date('01-01-2019'), new Date('01-12-2019')),
    new Place('p3', 'Not your average city trip!', 'A romantic place in Paris', 'https://i.pinimg.com/originals/18/30/b1/1830b1e06b0d68f0cab6809609ddc4cf.jpg', 99.99, new Date('01-01-2019'), new Date('01-12-2019'))
  ];

  get places() {
    return [...this._places]
  }

  getPlace(id: string) {
    return { ...this._places.find(p => p.id === id) };
  }

  constructor() { }
}
