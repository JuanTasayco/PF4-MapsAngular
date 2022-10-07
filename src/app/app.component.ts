import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as  mapboxgl from "mapbox-gl"
import { PlacesService } from './maps/services/places.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  title = 'FM4-Maps';
  ngOnInit(): void {
    (mapboxgl as any).accessToken = environment.mapboxToken;
  }

  goMyPosition(evento: MouseEvent) {
    this.service.goMyPosition(evento);
  }

  constructor(private service: PlacesService) { }

}











