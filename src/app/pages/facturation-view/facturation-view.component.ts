import { Component, OnInit } from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {FactureDetailComponent} from "../facturation/facture-detail/facture-detail.component";
import {ActivatedRoute, Router} from "@angular/router";
import {FactureService} from "../../@core/services/facture.service";

@Component({
  selector: 'app-facturation-view',
  template: ''
})
export class FacturationViewComponent implements OnInit {

  constructor(private dialog: MatDialog, private activatedRoute: ActivatedRoute, private factureService: FactureService) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(async params => {
      const reference_id = params.reference_id;
      if (reference_id) {
        const data: any = await this.factureService.viewFacture(reference_id).toPromise();
        this.dialog.open(FactureDetailComponent, {
          width: '600px',
          data: {
            ...data,
            hideFooterCut: true
          }
        })
      }
    })
  }

}
