import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-map-modal',
  templateUrl: './map-modal.component.html',
  styleUrls: ['./map-modal.component.scss'],
})
export class MapModalComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('map') mapElementRef: ElementRef;
  @Input() center = [51.505, -0.09];
  @Input() selectable = true;
  @Input() closeButtonText = 'Cancel';
  @Input() title = 'Pick Location';
  clickListener: any;
  map: any;

  constructor(private modalCtrl: ModalController, private renderer: Renderer2) { }

  ngOnInit() { }

  ngOnDestroy() {
    if (this.clickListener) {
      this.map.off('click');
    }
  }

  ngAfterViewInit() {
    this.getMap().then(mapModule => {
      const mapEl = this.mapElementRef.nativeElement;
      let placeMap = mapModule.map(mapEl, {
        center: this.center,
        zoom: 13
      });
      this.map = placeMap;
      mapModule.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(placeMap);

      placeMap.whenReady(() => {
        this.renderer.addClass(mapEl, 'visible');
      });

      if (this.selectable) {
        this.clickListener = placeMap.on('click', e => {
          const selectedCoords = {
            lat: e.latlng.lat,
            lng: e.latlng.lng
          }
          this.modalCtrl.dismiss(selectedCoords);
        });
      } else {
        mapModule.marker(this.center).addTo(placeMap);
      }
    }).catch(err => {
      console.log(err);
    });
  }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  private getMap(): Promise<any> {
    const win = window as any;
    const mapModule = win.L;
    if (mapModule) {
      return Promise.resolve(mapModule);
    }
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.7.1/dist/leaflet.js';
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = './assets/leaflet.map.css';
      document.querySelector('head').appendChild(link);
      script.onload = () => {
        const loadedMapModule = win.L;
        if (loadedMapModule) {
          resolve(loadedMapModule);
        } else {
          reject('Map not available');
        }
      }
    })
  }
}
