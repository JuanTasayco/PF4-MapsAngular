import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Feature, PlacesResponse } from '../interfaces/maps.interface';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  public userLocation?: [number, number];  // declaro el formato que tendrá la geolocalización , pongo ? porque puede que haya o no
  tokenmapBox: string = environment.mapboxToken;
  mapboxUrl: string = "https://api.mapbox.com/geocoding/v5/mapbox.places"



  //saber si la location del usuario está lista.
  get isUserLocationReady(): boolean {
    return (this.userLocation) ? true : false;
  }

  private observerMaps: Subject<[number, number]> = new Subject();
  //obtener ubicación del usuariog
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


  getPlacesByQuery(query: string): Observable<Feature[]> {
    const params = new HttpParams()
      .set("country", "pe")
      .set("limit", 5)
      .set("language", "es")
      .set("access_token", this.tokenmapBox)
      .set("proximity", this.userLocation!.join(","))

    return this.http.get<PlacesResponse>(`${this.mapboxUrl}/${query}.json?${params}`)
      .pipe(map(resp => resp.features))
  }



  constructor(private http: HttpClient) {
  }

}
