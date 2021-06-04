import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  constructor(private authService: AuthService) { }

  private _places = new BehaviorSubject<Place[]>([
    new Place('p1', 'Manhattan Mansion', 'In the heart of New York City.', 'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg', 149.99, new Date('01-01-2019'), new Date('01-12-2019'), 'abc'),
    new Place('p2', 'L\'Amour Toujours', 'A romantic place in Paris', 'https://i1.sndcdn.com/artworks-000133489765-rxqs2w-t500x500.jpg', 189.99, new Date('01-01-2019'), new Date('01-12-2019'), 'abc'),
    new Place('p3', 'Not your average city trip!', 'A romantic place in Paris', 'https://i.pinimg.com/originals/18/30/b1/1830b1e06b0d68f0cab6809609ddc4cf.jpg', 99.99, new Date('01-01-2019'), new Date('01-12-2019'), 'abc')
  ]);

  get places() {
    return this._places.asObservable();
  }

  getPlace(id: string) {
    return this.places.pipe(take(1), map(places => {
      return { ...places.find(p => p.id === id) };
    }));
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date) {
    const newPlace = new Place(Math.random().toString(), title, description, 'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg', price, dateFrom, dateTo, this.authService.userId);
    this.places.pipe(take(1)).subscribe(places => {
      this._places.next(places.concat(newPlace))
    })
  }
}
