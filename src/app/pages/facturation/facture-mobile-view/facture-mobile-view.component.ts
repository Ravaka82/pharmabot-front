import {Component, Input, OnInit} from '@angular/core';
import {Facture} from "../../../@core/interfaces";
import {FactureDetailComponent} from "../facture-detail/facture-detail.component";
import {MatDialog} from "@angular/material/dialog";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {FactureMobileReceivedbyComponent} from "./facture-mobile-receivedby/facture-mobile-receivedby.component";
import {FactureActions} from "../../../@core/store/actions";
import {select, Store} from "@ngrx/store";
import {takeUntil} from "rxjs/operators";
import {FactureSelector} from "../../../@core/store/selectors";
import {UnsubscribeComponent} from "../../../shared/component/unsubscribe/unsubscribe.component";

@Component({
  selector: 'app-facture-mobile-view',
  templateUrl: './facture-mobile-view.component.html',
  styleUrls: ['./facture-mobile-view.component.scss']
})
export class FactureMobileViewComponent extends UnsubscribeComponent implements OnInit {

  @Input() rows: Facture.FacturePage[] = [];
  @Input() isAuthorized: boolean = false;
  currentFacture!: Facture.FacturePage;
  loading = false;

  constructor(private dialog: MatDialog, private bottomSheet: MatBottomSheet, protected store: Store) {
    super();
  }

  ngOnInit(): void {
    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(FactureSelector.selectLoading)
    ).subscribe(loading => {
      this.loading = loading;
      if (!loading && this.currentFacture?.isUpdating) {
        this.currentFacture.isUpdating = false;
        this.currentFacture = {} as Facture.FacturePage;
      }
    })
  }

  getStatut(statut: string) {
    switch (statut) {
      case 'CREATED':
        return {
          color: 'bg-light',
          label: 'Créé'
        }
      case 'PAID':
        return {
          color: 'bg-success-chip',
          label: 'Payé'
        }
      case 'PAY_AVAILABLE':
        return {
          color: 'bg-warning-chip',
          label: 'Chèque disponible'
        }
      case 'WAITING':
      default:
        return {
          color: 'bg-danger-chip',
          label: 'En attente de paiement  '
        }
    }
  }

  openDetail(row: Facture.FacturePage): void {
    this.dialog.open(FactureDetailComponent, {
      data: row
    })
  }

  updateReceivedBy(facture: Facture.FacturePage): void {
    this.bottomSheet.open(FactureMobileReceivedbyComponent, {
      data: facture
    })
  }

  updatePaid(facture: Facture.FacturePage): void {
    this.currentFacture = facture;
    this.currentFacture.isUpdating = true;
    this.store.dispatch(FactureActions.UPDATE_REQUESTED({
      id: facture._id,
      changes: {
        paidAt: new Date(),
        status: 'PAID'
      }
    }))
  }
}
