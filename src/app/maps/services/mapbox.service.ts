import { Injectable } from '@angular/core';
import { LngLat, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Feature } from '../interfaces/maps.interface';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {

  private map?: Map;
  private markers: Marker[] = [];

  constructor() { }

  get isMapReady(): boolean {
    return !!this.map;
  }

  setMyMap(mapbox: Map) {
    this.map = mapbox;
  }

  flyToo(coordenadas: LngLatLike) {
    if (!this.isMapReady) throw Error("El mapa no ha cargado")
    if (this.isMapReady)
      this.map?.flyTo({
        zoom: 16,
        center: coordenadas
      })
  }


  //agregar todos los marcadores a penas se hace una busqueda.
  allMarkers(markers: Feature[]) {
    if (!this.isMapReady) throw Error("El mapa aún no ha cargado");
    this.markers.forEach(marker => marker.remove());

    const newMarkers: Marker[] = [];

    for (let marker of markers) {

      const [lng, lat] = marker.center;

      const popup = new Popup()
        .setHTML(`
           <h6>${marker.text}</h6>
           <span>${marker.place_name} </span>
        `)


      const newMarker = new Marker()
        .setLngLat([lng, lat])
        .setPopup(popup)
        .addTo(this.map!)

      newMarkers.push(newMarker)
    }

    this.markers = newMarkers;

  }


}
