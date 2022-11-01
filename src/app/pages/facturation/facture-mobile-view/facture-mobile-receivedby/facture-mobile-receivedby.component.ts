import {Component, Inject, OnInit} from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from "@angular/material/bottom-sheet";
import {Facture} from "../../../../@core/interfaces";
import {FactureActions} from "../../../../@core/store/actions";
import {select, Store} from "@ngrx/store";
import {takeUntil} from "rxjs/operators";
import {FactureSelector} from "../../../../@core/store/selectors";
import {UnsubscribeComponent} from "../../../../shared/component/unsubscribe/unsubscribe.component";

@Component({
  selector: 'app-facture-mobile-receivedby',
  templateUrl: './facture-mobile-receivedby.component.html',
  styleUrls: ['./facture-mobile-receivedby.component.scss']
})
export class FactureMobileReceivedbyComponent extends UnsubscribeComponent implements OnInit {

  receivedBy: string = ''

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: Facture.FacturePage,
    private bottomSheet: MatBottomSheetRef,
    protected store: Store
  ) {
    super();
  }

  ngOnInit(): void {
    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(FactureSelector.selectLoading)
    ).subscribe(loading => {
      if (!loading && this.data.isUpdating) {
        this.data.isUpdating = false;
        this.close();
      }
    })
  }

  close(): void {
    this.bottomSheet.dismiss();
  }

  save(): void {
    this.data.isUpdating = true;
    this.store.dispatch(FactureActions.UPDATE_REQUESTED({
      id: this.data._id,
      changes: {
        receivedBy: this.receivedBy,
        receivedAt: new Date(),
        status: 'WAITING'
      }
    }))
  }
}
