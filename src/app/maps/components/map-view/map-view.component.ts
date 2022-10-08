import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { PlacesService } from '../../services/places.service';
import * as  mapboxgl from "mapbox-gl";
import { Popup, Marker } from 'mapbox-gl';
import { MapboxService } from '../../services/mapbox.service';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrls: []
})
export class MapViewComponent implements AfterViewInit {

  @ViewChild("mapContainer") mapDiv!: ElementRef;
  map!: mapboxgl.Map;


  ngAfterViewInit(): void {
    if (!this.mapsService.userLocation) throw Error("No hay mapsService user Location");

    this.map = new mapboxgl.Map({
      container: this.mapDiv.nativeElement,
      style: 'mapbox://styles/mapbox/light-v10',
      center: this.mapsService.userLocation,
      zoom: 16
    });

    this.mapboxService.setMyMap(this.map);

    const popup = new Popup()
      .setHTML(
        `
      <h5 class="fw-bold">Estás aquí</h5>
    `);

    new Marker({ color: "red" })
      .setLngLat(this.mapsService.userLocation)
      .setPopup(popup)
      .addTo(this.map);
  }




  constructor(private mapsService: PlacesService, private mapboxService: MapboxService) {
    this.mapsService.eventClickToMyPosition.subscribe(eventoClick => {
      this.map.flyTo({
        center: this.mapsService.userLocation,
        zoom: 17,
        essential: true
      })
    })
  }

}
