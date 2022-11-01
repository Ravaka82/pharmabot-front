import {AfterViewInit, Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ColumnMode, TableColumn} from "@swimlane/ngx-datatable";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {FactureDetailComponent} from "./facture-detail/facture-detail.component";
import {Facture} from "../../@core/interfaces";
import {select, Store} from "@ngrx/store";
import {UnsubscribeComponent} from "../../shared/component/unsubscribe/unsubscribe.component";
import {filter, takeUntil} from "rxjs/operators";
import {AccountSelector, CatalogueGroupeSelector, FactureSelector} from "../../@core/store/selectors";
import {FactureActions} from "../../@core/store/actions";
import {IConfirmationDialog} from "../../@core/interfaces/confirmation-dialog.interface";
import {ModalConfirmationService} from "../../@core/services/modal-confirmation.service";
import {MaskApplierService} from "ngx-mask";
import {orderBy as _orderBy} from 'lodash';
import {combineLatest, Observable} from "rxjs";
import {UiService} from "../../@core/services/ui.service";

@Component({
  selector: 'app-abonnement',
  templateUrl: './facturation.component.html',
  styleUrls: ['./facturation.component.scss']
})
export class FacturationComponent extends UnsubscribeComponent implements OnInit, AfterViewInit {
  ColumnMode = ColumnMode;
  rows: Facture.FacturePage[] = [];
  columns: TableColumn[] = [];
  rowSelected!: Facture.FacturePage[];
  itemDelete: any;
  isDeleting: boolean = false;
  loading: boolean = false;
  accountCatalogueGroupeName: string = '';
  isAuthorized: boolean = false;
  isMobile$ !: Observable<boolean>;

  @ViewChild('detail') detailTemplate: TemplateRef<any> | any;
  @ViewChild('statut') statutTemplate: TemplateRef<any> | any;
  @ViewChild('receivedTemplate') receivedTemplate: TemplateRef<any> | any;
  @ViewChild('paidTemplate') paidTemplate: TemplateRef<any> | any;
  @ViewChild('payAvailableTemplate') payAvailableTemplate: TemplateRef<any> | any;
  @ViewChild('receivedByTemplate') receivedByTemplate: TemplateRef<any> | any;
  @ViewChild('referenceTemplate') referenceTemplate: TemplateRef<any> | any;
  @ViewChild('deleteTemplate') deleteTemplate: TemplateRef<any> | any;

  constructor(
    private dialog: MatDialog,
    protected store: Store,
    private modalConfirmation: ModalConfirmationService,
    private mask: MaskApplierService,
    private uiService: UiService
  ) {
    super()
  }

  ngOnInit(): void {
    this.isMobile$ = this.uiService.isMobileView$.pipe(takeUntil(super.unsubscribe()));

    combineLatest([
      this.store.select(AccountSelector.selectState),
      this.store.select(CatalogueGroupeSelector.selectEntities)
    ]).pipe(
      takeUntil(super.unsubscribe()),
      filter(([account, catalogueGroupeEntities]) => !!account && !!catalogueGroupeEntities)
    ).subscribe(([account, catalogueGroupeEntities]) => {
      this.isAuthorized = account?.role?.name === 'ADMIN' || account?.role?.name === 'MANAGER';
      this.accountCatalogueGroupeName = catalogueGroupeEntities[(account as any).catalogueGroupe]?.name || ''

      setTimeout(() => {
        this.columns =  [
          { prop: 'reference', flexGrow: 20, name: 'Facture N°', cellTemplate: this.referenceTemplate},
          { prop: 'receivedAt', name: 'Reçu le', flexGrow: 25, cellTemplate: this.receivedTemplate},
          { prop: 'receivedBy', name: 'Par', flexGrow: 30, cellTemplate: this.receivedByTemplate },
          { prop: 'status', name: 'Statut', cellTemplate: this.statutTemplate, flexGrow: 35 },
          { name: 'Chèque dispo.', flexGrow: 20, cellTemplate: this.payAvailableTemplate },
          { prop: 'paidAt', name: 'Remise chèque le', flexGrow: 20, cellTemplate: this.paidTemplate },
          { name: 'Detail', cellTemplate: this.detailTemplate, flexGrow: 10 }
        ]
        if (this.isAuthorized) {
          this.columns.push(
            { name: 'Groupe', prop: 'catalogueGroupe.name', flexGrow: 10 },
            { name: '', cellTemplate: this.deleteTemplate, flexGrow: 10 }
          )
        }
      })
    })

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(FactureSelector.selectAll)
    ).subscribe(rows => {
      this.rows = _orderBy(
        rows.map(row => ({...row, receivedByInput: false })),
        ['createdAt'],
        ['desc']
      )
    });

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(FactureSelector.selectLoading)
    ).subscribe(loading => {
      this.loading = loading;
      if (!loading && this.isDeleting) {
        this.itemDelete.loading = false;
        this.dialog.closeAll();
        this.modalConfirmation.openModal({
          data: {
            lottie: 'assets/lotties/notification.json',
            title: 'Notification',
            showConfirm: true,
            confirmLabel: 'OK',
            content: `La facture ref: <b>${this.mask.applyMask(this.rowSelected[0]?.reference, 'SSS/0000/0*')}</b> a été supprimé avec succès`
          }
        });
        this.itemDelete = {};
        this.rowSelected = [];
        this.isDeleting = false;
      }
    })
  }

  ngAfterViewInit() {
  }

  updateReceivedBy(id: string, receivedBy: string): void {
    this.store.dispatch(FactureActions.UPDATE_REQUESTED({
      id,
      changes: {
        receivedBy,
        receivedAt: new Date(),
        status: 'WAITING'
      }
    }))
  }

  updatePaid(id: string): void {
    this.store.dispatch(FactureActions.UPDATE_REQUESTED({
      id,
      changes: {
        paidAt: new Date(),
        status: 'PAID'
      }
    }))
  }

  updateAvailableAt(id: string): void {
    this.store.dispatch(FactureActions.UPDATE_REQUESTED({
      id,
      changes: {
        payAvailableAt: new Date(),
        status: 'PAY_AVAILABLE'
      }
    }))
  }

  openDetail(row: Facture.Entry): void {
    this.dialog.open(FactureDetailComponent, {
      data: row,
      width: '600px'
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

  deleteFacture(row: Facture.FacturePage): void {
    this.rowSelected = [row];
    this.itemDelete = {
      title: 'ATTENTION',
      content: `<p>Voulez-vous vraiment supprimer cette facture ref: <b>${this.mask.applyMask(row.reference, 'SSS/0000/0*')}</b>?</p>`,
      cancelLabel: 'Annuler',
      showConfirm: true,
      showCancel: true,
      lottie: 'assets/lotties/alert.json',
      onConfirm: (data: IConfirmationDialog) => {
        data.loading = true;
        this.isDeleting = true;
        this.store.dispatch(FactureActions.DELETE_REQUESTED({
          input: { _id: row._id }
        }))
      },
      onCancel: (data: IConfirmationDialog, dialogRef: MatDialogRef<any>) => {
        dialogRef.close();
        this.itemDelete = {};
        this.isDeleting = false;
      },
    }
    this.modalConfirmation.openModal({data: this.itemDelete, disableClose: true});
  }
}
