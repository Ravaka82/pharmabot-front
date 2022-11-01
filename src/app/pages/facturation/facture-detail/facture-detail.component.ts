import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {Facture} from "../../../@core/interfaces";
// @ts-ignore
import * as SpellIt from 'spell-it';

@Component({
  selector: 'app-facture-detail',
  templateUrl: './facture-detail.component.html',
  styleUrls: ['./facture-detail.component.scss']
})
export class FactureDetailComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: Facture.FacturePage) { }

  ngOnInit(): void {
    console.log('Facture::', this.data)
  }

  getTotal() {
    let total = 0;
    if (this.data?.facturation) {
      for (const item of this.data?.facturation) {
        total += item.quantity * item.price;
      }
    }
    return total;
  }

  readTotalToText() {
    const spell = SpellIt('fr');
    return spell(this.getTotal())
  }
}
