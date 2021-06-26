import { HttpClient } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ActionSheetController, AlertController, ModalController } from '@ionic/angular';
import { of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Coordinates, PlaceLocation } from 'src/app/places/location.model';
import { MapModalComponent } from '../../map-modal/map-modal.component';
import { Geolocation } from '@capacitor/geolocation';
import { Capacitor } from '@capacitor/core';

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  selectedLocationImage: string;
  @Output() locationPick = new EventEmitter<PlaceLocation>();
  @Input() showPrivew = false;

  constructor(private modalCtrl: ModalController, private http: HttpClient, private actionSheetCtrl: ActionSheetController, private alertCtrl: AlertController) { }

  ngOnInit() { }

  onPickLocation() {
    this.actionSheetCtrl.create({
      header: 'Please Choose',
      buttons: [
        {
          text: 'Auto-Locate',
          handler: () => {
            this.locateUser()
          }
        },
        {
          text: 'Pick on Map',
          handler: () => {
            this.openMap()
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    }).then(actionSheetEl => {
      actionSheetEl.present();
    })
  }

  private locateUser() {
    if (!Capacitor.isPluginAvailable('Geolocation')) {
      this.showErrorAlert();
      return;
    }
    Geolocation.getCurrentPosition()
      .then(geoPosition => {
        const coordinates: Coordinates = { lat: geoPosition.coords.latitude, lng: geoPosition.coords.longitude };
        this.createPlace(coordinates.lat, coordinates.lng);
      })
      .catch(err => {
        this.showErrorAlert();
      })
  }

  private showErrorAlert() {
    this.alertCtrl.create({
      header: 'Could not fetch location',
      message: 'Please use the map to pick a location'
    }).then(alertEl => alertEl.present());
  }

  private openMap() {
    this.modalCtrl.create({
      component: MapModalComponent
    }).then(modalEl => {
      modalEl.onDidDismiss().then(modalData => {
        if (!modalData.data) {
          return;
        }
        const coordinates: Coordinates = {
          lat: modalData.data.lat,
          lng: modalData.data.lng
        };
        this.createPlace(coordinates.lat, coordinates.lng);
      });
      modalEl.present();
    })
  }

  private createPlace(lat: number, lng: number) {
    const pickedLocation: PlaceLocation = {
      lat: lat,
      lng: lng,
      address: null,
      staticMapImageUrl: null
    };

    this.getAddress(lat, lng).pipe(switchMap(address => {
      pickedLocation.address = address;
      return of(this.getMapImage(pickedLocation.lat, pickedLocation.lng, 14))
    })
    ).subscribe(staticMapImageUrl => {
      pickedLocation.staticMapImageUrl = staticMapImageUrl;
      this.selectedLocationImage = staticMapImageUrl;
      this.locationPick.emit(pickedLocation);
    })
  }

  private getAddress(lat: number, lng: number) {
    return this.http.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`)
      .pipe(map((geoData: any) => {
        if (!geoData || !geoData.name || !geoData.display_name) {
          return null;
        }
        return geoData.display_name;
      }))
  }

  private getMapImage(lat: number, lng: number, zoom: number) {
    return `http://a.tile.openstreetmap.org/${zoom}/${lon2tile(lng, zoom)}/${lat2tile(lat, zoom)}.png `;

    function lon2tile(lon, zoom) { return (Math.floor((lon + 180) / 360 * Math.pow(2, zoom))); }
    function lat2tile(lat, zoom) { return (Math.floor((1 - Math.log(Math.tan(lat * Math.PI / 180) + 1 / Math.cos(lat * Math.PI / 180)) / Math.PI) / 2 * Math.pow(2, zoom))); }
  }
}
