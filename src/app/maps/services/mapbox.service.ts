import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AnySourceData, LngLatBounds, LngLatLike, Map, Marker, Popup } from 'mapbox-gl';
import { Observable, of, switchMap, tap } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Directions, Route } from '../interfaces/directionsRoute.interface';
import { Feature } from '../interfaces/maps.interface';

@Injectable({
  providedIn: 'root'
})
export class MapboxService {

  private map?: Map;
  private markers: Marker[] = [];
  tokenmapBox: string = environment.mapboxToken;
  mapboxRoutesUrl: string = "https://api.mapbox.com/directions/v5/mapbox/driving";



  constructor(private http: HttpClient) { }

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
  allMarkers(markers: Feature[], userLocation: [number, number]) {
    if (!this.isMapReady) throw Error("El mapa aún no ha cargado");
    this.markers.forEach(marker => marker.remove());

    const newMarkers: any[] = [];

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

    if (markers.length === 0) return;

    const ubicacion = userLocation;
    const bounds = new LngLatBounds();

    newMarkers.forEach(marker => bounds.extend(marker.getLngLat()))
    bounds.extend(ubicacion)

    this.map?.fitBounds(bounds, { padding: 200 });

  }


  getMapboxGeneratedRoute(origen: [number, number], destino: [number, number]) {
    const params = new HttpParams()
      .set("alternatives", false)
      .set("geometries", "geojson")
      .set("language", "es")
      .set("steps", true)
      .set("overview", "simplified")
      .set("access_token", this.tokenmapBox);

    return this.http.get<Directions>(`${this.mapboxRoutesUrl}/${origen.join("%2C")}%3B${destino.join("%2C")}?${params}`)
      .pipe(switchMap(resp => this.drawPoliline(resp.routes[0])))

  }


  private drawPoliline(route: Route) {

    if (!this.map) throw Error("Mapa no inicializado");
    const coords = route.geometry.coordinates; // --> OBTENGO EL ARREGLO DE COORDENADAS DE LA RUTA
    const bounds = new LngLatBounds(); //--> CREO LIMITES PARA QUE EL MAPA MUESTRE SOLO EL RANGO DE LA RUTA DESDE MI PUNTO HASTA EL DESTINO QUE ELIJO

    coords.forEach(([lng, lat]) => {  // DESESTRUCTURO LNG, LAT PORQUE SI LO ENVÍO ASÍ NOMAS ME SALDRÁ QUE NO ES DE TIPO NUMBER [] Y PROBLMAMS EN EL TIPADO
      bounds.extend([lng, lat])
    })

    this.map?.fitBounds(bounds, {  // Y AQUÍ SIMPLMENTE LE DIGO A MI MAPA QUE HAGA CASO A ESTOS LIMITES
      padding: 200
    })


    const sourceData: AnySourceData = {  //--> DIBUJAR POLYLINES
      type: "geojson",
      data: {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            properties: {},
            geometry: {
              type: "LineString",
              coordinates: coords
            }
          }
        ]
      }
    }

    if (this.map.getLayer("RouteString")) {
      this.map.removeLayer("RouteString");
      this.map.removeSource("RouteString");
    }


    this.map?.addSource("RouteString", sourceData) // ---> AGREGAR MI CONFIGURACIÓN DEL POLYLINE

    this.map.addLayer({   // --> AGREGAR DISEÑO AL POLYLINE, ESTO ES OBLIGATORIO
      id: "RouteString",
      type: "line",
      source: "RouteString",  // ---> ESTRICTAMENTE OBLIGATORIO DE NOBRE IGUAL QUE MI SOURCEDATA
      layout: {
        "line-cap": "round",
        "line-join": "round"
      },
      paint: {
        "line-color": "black",
        "line-width": 3
      }
    })
    return of({ kms: route.distance / 1000, duration: route.duration / 60 });
  }

  removePolylines() {
    if (this.map?.getLayer("RouteString")) {
      this.map.removeLayer("RouteString");
      this.map.removeSource("RouteString");
    }
  }


}
