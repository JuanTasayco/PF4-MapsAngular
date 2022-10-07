import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PlacesService } from '../../services/places.service';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: []
})
export class MapsComponent implements OnInit {


  ngOnInit(): void {
    this.mapsService.getLocationUser().subscribe(console.log)
  }

  get isUserLocationReady() {
    return this.mapsService.isUserLocationReady;
  }

  constructor(private mapsService: PlacesService) { }

}
