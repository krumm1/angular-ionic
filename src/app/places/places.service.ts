import { Injectable } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { Place } from './place.model';
import { take, map, tap, delay, switchMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { PlaceLocation } from './location.model';

interface PlaceData {
  availableFrom: string;
  availableTo: string;
  description: string;
  imageUrl: string;
  price: number;
  title: string;
  userId: string;
  location: PlaceLocation
}

// [
//   new Place('p1', 'Manhattan Mansion', 'In the heart of New York City.', 'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg', 149.99, new Date('01-01-2019'), new Date('01-12-2019'), 'abc'),
//   new Place('p2', 'L\'Amour Toujours', 'A romantic place in Paris', 'https://i1.sndcdn.com/artworks-000133489765-rxqs2w-t500x500.jpg', 189.99, new Date('01-01-2019'), new Date('01-12-2019'), 'abc'),
//   new Place('p3', 'Not your average city trip!', 'A romantic place in Paris', 'https://i.pinimg.com/originals/18/30/b1/1830b1e06b0d68f0cab6809609ddc4cf.jpg', 99.99, new Date('01-01-2019'), new Date('01-12-2019'), 'abc')
// ]

@Injectable({
  providedIn: 'root'
})
export class PlacesService {
  constructor(private authService: AuthService, private http: HttpClient) { }

  private _places = new BehaviorSubject<Place[]>([]);

  get places() {
    return this._places.asObservable();
  }

  fetchPlaces() {
    return this.http.get<{ [key: string]: PlaceData }>('https://ionic-angular-practice-60708-default-rtdb.asia-southeast1.firebasedatabase.app/offered-places.json').pipe(map(resData => {
      const places = [];
      for (let key in resData) {
        if (resData.hasOwnProperty(key)) {
          places.push(new Place(key, resData[key].title, resData[key].description, resData[key].imageUrl, resData[key].price, new Date(resData[key].availableFrom), new Date(resData[key].availableTo), resData[key].userId, resData[key].location));
        }
      }
      return places;
    }),
      tap(places => {
        this._places.next(places);
      })
    );
  }

  getPlace(id: string) {
    return this.http.get<PlaceData>(`https://ionic-angular-practice-60708-default-rtdb.asia-southeast1.firebasedatabase.app/offered-places/${id}.json`).pipe(map(placeData => {
      return new Place(id, placeData.title, placeData.description, placeData.imageUrl, placeData.price, new Date(placeData.availableFrom), new Date(placeData.availableTo), placeData.userId, placeData.location);
    }))
    // return this.places.pipe(take(1), map(places => {
    //   return { ...places.find(p => p.id === id) };
    // }));
  }

  addPlace(title: string, description: string, price: number, dateFrom: Date, dateTo: Date, location: PlaceLocation) {
    let generatedId: string;
    const newPlace = new Place(Math.random().toString(), title, description, 'https://imgs.6sqft.com/wp-content/uploads/2014/06/21042533/Carnegie-Mansion-nyc.jpg', price, dateFrom, dateTo, this.authService.userId, location);

    return this.http.post<{ name: string }>('https://ionic-angular-practice-60708-default-rtdb.asia-southeast1.firebasedatabase.app/offered-places.json', { ...newPlace, id: null })
      .pipe(switchMap(resData => {
        generatedId = resData.name;
        return this.places
      }),
        take(1),
        tap(places => {
          newPlace.id = generatedId;
          this._places.next(places.concat(newPlace))
        })
      );
    // return this.places.pipe(take(1), delay(1500), tap(places => {
    //   this._places.next(places.concat(newPlace))
    // }))
  }

  updatePlace(placeId: string, title: string, description: string) {
    let updatedPlaces: Place[];
    return this.places.pipe(
      take(1),
      switchMap(places => {
        if (!places || places.length <= 0) {
          return this.fetchPlaces();
        } else {
          return of(places);
        }
      }),
      switchMap(places => {
        const updatedPlaceIndex = places.findIndex(pl => pl.id == placeId);
        updatedPlaces = [...places];
        const oldPlace = updatedPlaces[updatedPlaceIndex];
        updatedPlaces[updatedPlaceIndex] = new Place(oldPlace.id, title, description, oldPlace.imageUrl, oldPlace.price, oldPlace.availableFrom, oldPlace.availableTo, oldPlace.userId, oldPlace.location);

        return this.http.put(`https://ionic-angular-practice-60708-default-rtdb.asia-southeast1.firebasedatabase.app/offered-places/${placeId}.json`, { ...updatedPlaces[updatedPlaceIndex], id: null });
      }),
      tap(() => {
        this._places.next(updatedPlaces);
      }));
  }
}
