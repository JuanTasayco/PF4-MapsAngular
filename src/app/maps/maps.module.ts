import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapsComponent } from './screens/maps/maps.component';
import { LoadingComponent } from './components/loading/loading.component';
import { MapViewComponent } from './components/map-view/map-view.component';



@NgModule({
  declarations: [
    MapsComponent,
    LoadingComponent,
    MapViewComponent
  ],
  exports: [
    MapsComponent
  ],
  imports: [
    CommonModule
  ]
})
export class MapsModule { }
