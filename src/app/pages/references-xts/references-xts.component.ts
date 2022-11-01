import { Component, OnInit, ViewChild } from "@angular/core";
import { UnsubscribeComponent } from "src/app/shared/component/unsubscribe/unsubscribe.component";
import { ColumnMode, DatatableComponent, SelectionType, TableColumn} from "@swimlane/ngx-datatable";
import { Archive,ProductRefs,RefsMap } from "src/app/@core/interfaces";
import { EntriesSearch } from "src/app/utils";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DateAdapter } from "@angular/material/core";
import { select, Store } from "@ngrx/store";
import { ModalConfirmationService } from "src/app/@core/services/modal-confirmation.service";
import { ArchiveSelector, ProductRefsSelector, RefsMapSelector } from "src/app/@core/store/selectors";
import { ProductRefsActions, RefsMapActions } from "src/app/@core/store/actions";
import { map as _map} from 'lodash';
import { takeUntil} from "rxjs/operators";
import { AbstractControl, FormControl, FormGroup, Validators } from "@angular/forms";
import { IConfirmationDialog } from "src/app/@core/interfaces/confirmation-dialog.interface";
import { Router } from "@angular/router";

@Component({
  selector: 'app-references-xts',
  templateUrl: './references-xts.component.html',
  styleUrls: ['./references-xts.component.scss']
})
export class ReferencesXtsComponent extends UnsubscribeComponent implements OnInit {
 
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  rows: Archive.Entry[] = [];
  itemAdd!: any;
  columns: TableColumn[] = [];
  loading: boolean = false;
  isAdding: boolean = false;
  selected!: Archive.Entry;
  bulkSelected: string[] = [];
  searchRows!: EntriesSearch<any>;
  searchValue: string = '';
  submitting: boolean = false;
  emptyForm:string =  "*Veuillez renseigner ce champ";
  refsMap: RefsMap.Entry[] = [];
  productRefs : ProductRefs.Entry[]=[];
  selected2!: ProductRefs.Entry;
  itemDelete!: IConfirmationDialog;
  isDeleting = false;
  nomCommunForm: FormGroup = {} as FormGroup;

  @ViewChild('table', {static: true}) table !: DatatableComponent;

  constructor
  (
   private modalRef: MatDialog,
   private _adapter: DateAdapter<any>,
   protected store: Store,
   private modalConfirmation: ModalConfirmationService,
   private router: Router
  ) {
    super();
    this._adapter.setLocale('fr')
  }

  initNomCommunForm(): void {
    this.nomCommunForm = new FormGroup({
      nom: new FormControl('')
    });
  } 

  ngOnInit(): void {
    this.initNomCommunForm();
    
    this.store.dispatch(RefsMapActions.LOAD_REQUESTED());

    this.store.dispatch(ProductRefsActions.LOAD_REQUESTED());


    this.store.select(ProductRefsSelector.selectAll)
    .subscribe(productRefs => {
      this.productRefs = productRefs;
      
    });


    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(ArchiveSelector.selectAll)
    ).subscribe(rows => {
      this.rows = rows;
      this.searchRows = new EntriesSearch([...this.rows]).setColumns(['designation','fournisseur','prix']);
    });


    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(ArchiveSelector.selectLoading)
    ).subscribe(loading => {
      this.loading = loading;
      if (!loading && this.isAdding) {
        this.itemAdd.loading = false;
        this.modalRef.closeAll();
        this.modalConfirmation.openModal({
          data: {
            lottie: 'assets/lotties/done.json',
            showConfirm: true,
            confirmLabel: 'OK',
            title: 'Notification',
            content: `Nom en commun valider avec succès`
          }
        });
        this.itemAdd = {};
        this.isAdding = false;
        this.bulkSelected = [];
        this.rows = this.searchRows.search(this.searchValue);
      }
    });
    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(ProductRefsSelector.selectLoading)
    ).subscribe(loading => {
      this.loading = loading;
      if (!loading && this.isDeleting) {
        this.itemDelete.loading = false;
        this.modalRef.closeAll();
        this.modalConfirmation.openModal({
          data: {
            lottie: 'assets/lotties/notification.json',
            title: 'Notification',
            showConfirm: true,
            confirmLabel: 'OK',
            content: `Le nom commun <b>${this.selected2.refsMap?.name}</b> a été supprimé avec succès`
          }
        });
        this.itemDelete = {};
        this.isDeleting = false;
      }
    })

  }

  ajoutNomCommun(nomCommun:string) {
    this.itemAdd = {
      title: 'CONFIRMATION',
      content: `<p>Voulez-vous utiliser <strong>${nomCommun}</strong> comme nom en commun pour ces éléments?</p>`,
      cancelLabel: 'Annuler',
      confirmLabel: 'Valider',
      showConfirm: true,
      showCancel: true,
      lottie: 'assets/lotties/transfer-files.json',
      onConfirm:  (data: IConfirmationDialog) => {
        data.loading = true;
        this.isAdding = true;
        this.onValidate(nomCommun);
        this.ngOnInit();
    },
  onCancel: (data: IConfirmationDialog, dialogRef: MatDialogRef<any>) => {
        dialogRef.close();
        this.itemAdd = {} as any;
        this.isAdding = false;
        this.ngOnInit();
      },
    }
    this.modalConfirmation.openModal({data: this.itemAdd, disableClose: true});
  }

  get f(): { [key: string]: AbstractControl } {
    return this.nomCommunForm.controls;
  }

  onValidate(nomCommun:string){
    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(RefsMapSelector.selectAll)
    ).subscribe(refsMap => {
      this.refsMap = refsMap;
      for(const refs of refsMap){
        console.log("boucle refa submit : "+refs['name'])
        if(nomCommun.localeCompare(refs['name'])==0){
          console.log("ref name" + refs['name'] )
          for(let selected of this.bulkSelected){
            this.store.dispatch(ProductRefsActions.CREATE_REQUESTED({
              input: [{
                nameProduct: selected,
                refsMap: refs['_id']
              }]
            }))
          }
        }
      }
  })
  this.ngOnInit();
  }

  reloadComponent() {
    let currentUrl = this.router.url;
        this.router.routeReuseStrategy.shouldReuseRoute = () => false;
        this.router.onSameUrlNavigation = 'reload';
        this.router.navigate([currentUrl]);
    }

  onSearch(value: string): void {
    this.rows = this.searchRows.search(value);
    this.searchValue = value;
  }

  onSelect(event: any): void {
    const {selected} = event;
    const elements = [...selected];
    this.bulkSelected = _map(elements, 'designation')
  }
  openDetail(row: ProductRefs.Entry) {
    // this.modal.open(HistoryDetailComponent, {
      // data: row,
      // disableClose: false
    // })
  }

  nomCommun(): any {
    this.submitting = true;
    if (this.nomCommunForm.get("nom")?.value == '') {
      return this.emptyForm;
    }else{
    const nomCommun = this.nomCommunForm.get("nom")?.value;
      this.store.dispatch(RefsMapActions.CREATE_REQUESTED({
        input: {
          name: nomCommun
        }
      }))
      this.ajoutNomCommun(nomCommun);
      this.reloadComponent();
    }
  }
  deleteProduit(row2: ProductRefs.Entry): void {
    this.selected2 = row2;
    console.log("kokoko"+ row2._id );
    this.itemDelete = {
      title: 'ATTENTION',
      content: '<p>Voulez-vous vraiment supprimer cet élément?</p>',
      cancelLabel: 'Annuler',
      showConfirm: true,
      showCancel: true,
      lottie: 'assets/lotties/alert.json',
      onConfirm: (data: IConfirmationDialog) => {
        data.loading = true;
        this.isDeleting = true;
        this.store.dispatch(ProductRefsActions.DELETE_REQUESTED({
          input: { _id: row2._id }
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
