import {Map } from "src/app/@core/interfaces";
import { Component, AfterViewInit } from '@angular/core';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as L from 'leaflet';
import { Fournisseur } from 'src/app/@core/interfaces';
import { FournisseurActions, MapActions } from 'src/app/@core/store/actions';
import { FournisseurSelector, MapSelector } from 'src/app/@core/store/selectors';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  map!: L.Map;
  loading: boolean = false;
  fournisseurs: Fournisseur.Entry[] = [];
  oneFournisseur: Map.Entry[]=[];
  type: any;
  Id!:string;
  private initMap(): void {
    this.map = L.map('map', {
      center: [ -18.873777887439484, 47.52409278743554 ],
      zoom: 12
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
  }

  constructor(protected store: Store, private router: Router) { }
  reloadComponent() {
    let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
    }
  changeRatio(event: MatSelectChange){ 
 
    this.Id='';
    this.type= event.value;
    console.log(this.type);
  }
 
  ngAfterViewInit(): void {
    this.initMap();
    this.store.select(FournisseurSelector.selectAll)
    .subscribe(fournisseurs => {
      this.fournisseurs = fournisseurs
    })
    var myIcon = L.icon({
      iconUrl: 'assets/svg/ic.png',
      iconSize: [40,40],
      });
    const marker2 = L.marker([-18.890130088170473, 47.524795830296284], {icon: myIcon}).bindPopup( -18.890130088170473+','+47.524795830296284+'<br><br>FOURNISSEUR : pharmacie duroi').openPopup();
    marker2.addTo(this.map);
  }
  onSubmit(){
    this.Id =this.type;
    const addOneFournisseurId = this.Id;
    this.store.dispatch(MapActions.LOAD_REQUESTED({
      addOneFournisseurId
    }));
    this.store.select(MapSelector.selectAll)
    .subscribe(oneFournisseur => {
      this.oneFournisseur = oneFournisseur;
      console.log(this.oneFournisseur)
        for(let one of oneFournisseur){
          var myIcon = L.icon({
            iconUrl: 'assets/svg/pin.png',
            iconSize: [40,40],
            });
          const longitude= one.positionx; 
          const latitude = one.positiony;
          const marker = L.marker([longitude,latitude], {icon: myIcon}).bindPopup( one.positionx+','+one.positiony+'<br><br>FOURNISSEUR : '+one.name).openPopup();
          console.log(marker);
          marker.addTo(this.map);
        }
    });
  }
  onclick(){
    this.store.dispatch(FournisseurActions.LOAD_REQUESTED());
    this.store.select(FournisseurSelector.selectAll)
    .subscribe(fournisseurs => {
      this.fournisseurs = fournisseurs;
      console.log("fournisseur"+ fournisseurs);
        for(let fournisseur of fournisseurs){
          var myIcon = L.icon({
            iconUrl: 'assets/svg/home.png',
            iconSize: [40,40],
            });
          const longitude= fournisseur.positionx; 
          const latitude = fournisseur.positiony;
          const marker = L.marker([longitude,latitude], {icon: myIcon}).bindPopup( fournisseur.positionx+','+fournisseur.positiony+'<br><br>FOURNISSEUR : '+fournisseur.name).openPopup(); 
          console.log(marker);
          marker.addTo(this.map);
        }
    });
  }
}