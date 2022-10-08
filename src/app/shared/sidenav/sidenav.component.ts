import { Component, OnInit } from '@angular/core';
import { debounceTime, Subject, switchMap } from 'rxjs';
import { Feature } from 'src/app/maps/interfaces/maps.interface';
import { MapboxService } from 'src/app/maps/services/mapbox.service';
import { PlacesService } from 'src/app/maps/services/places.service';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: []
})
export class SidenavComponent implements OnInit {

  constructor(private placeService: PlacesService,
    private mapBoxService: MapboxService) { }

  debounce: Subject<string> = new Subject()
  places: Feature[] = [];
  placesIsReady: boolean = true;
  idSelected: string = "";
  obtenerRestaurantes(event: any) {
    this.placesIsReady = false;

    this.debounce.pipe(
      debounceTime(300),
      switchMap(valor => this.placeService.getPlacesByQuery(valor)))
      .subscribe(places => {
        this.places = places;
        this.mapBoxService.allMarkers(this.places);
        this.placesIsReady = true;
      })

    this.debounce.next(event.target.value);
  }

  flyToo(coord: any) {
    this.idSelected = coord.id;
    this.mapBoxService.flyToo(coord.center);
  }

  ngOnInit(): void {
  }

}
