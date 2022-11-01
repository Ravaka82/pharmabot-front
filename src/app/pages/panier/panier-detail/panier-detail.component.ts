import { Component,OnInit } from '@angular/core';
import { Panier } from 'src/app/@core/interfaces';
import { Store } from "@ngrx/store";
// @ts-ignore
import * as SpellIt from 'spell-it';

import { PanierSelector } from 'src/app/@core/store/selectors';
@Component({
  selector: 'app-panier-detail',
  templateUrl: './panier-detail.component.html',
  styleUrls: ['./panier-detail.component.scss']
})
export class PanierDetailComponent implements OnInit {
  data: Panier.Entry[] = [];
  sommeTotal:any ;
  rowTotal = {
    label: 'Total',
    prix: 0
  }
  spell: any;
  constructor(
    protected store: Store,
) { }

  ngOnInit(): void {
    this.store.select(PanierSelector.selectAll)
    .subscribe(data => {
      this.data = data;
      this.sommeTotal = data.reduce((accumulator, object) => {
        return accumulator + (object.prix*object.cart_count);
      }, 0);
      this.readTotalToText();
    });
  }
  readTotalToText() {
    this.spell = SpellIt('fr');
    return this.spell(this.sommeTotal)
  }
}