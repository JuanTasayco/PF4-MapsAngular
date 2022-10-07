import { Injectable } from '@angular/core';
import { Observable, of, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation?: [number, number];  // declaro el formato que tendrá la geolocalización , pongo ? porque puede que haya o no

  get isUserLocationReady(): boolean {     // hago doble negacion para el true, es decir si la localización está lista, devuelve true;
    return (this.userLocation) ? true : false;
  }

  private observerMaps: Subject<[number, number]> = new Subject();

  public getLocationUser(): Observable<[number, number]> {
    navigator.geolocation.getCurrentPosition(({ coords }) => {
      this.userLocation = [coords.longitude, coords.latitude];
      this.observerMaps.next(this.userLocation);
    })
    return this.observerMaps;
  }



  //permite enviar el evento click del componente que contiene la imagen hacia el mapview que contiene la información mapBox, a través del servicio.
  eventClickToMyPosition: Subject<MouseEvent> = new Subject();

  goMyPosition(event: MouseEvent) {
    this.eventClickToMyPosition.next(event);
  }

  constructor() {
  }

}
