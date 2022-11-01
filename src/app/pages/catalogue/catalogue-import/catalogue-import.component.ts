import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import * as XLSX from 'xlsx';
import {WorkBook} from 'xlsx';
import {AnimationOptions} from "ngx-lottie";
import {CatalogueActions, CatalogueImportActions} from "../../../@core/store/actions";
import {Catalogue, CatalogueImport} from "../../../@core/interfaces";
import {select, Store} from "@ngrx/store";
import {UnsubscribeComponent} from "../../../shared/component/unsubscribe/unsubscribe.component";
import {CatalogueImportSelector, CatalogueSelector} from "../../../@core/store/selectors";
import {takeUntil} from "rxjs/operators";
import {GET_ITEM_STORAGE} from "../../../utils";
import {ActivatedRoute} from "@angular/router";
import {DateAdapter} from "@angular/material/core";

@Component({
  selector: 'app-catalogue-import',
  templateUrl: './catalogue-import.component.html',
  styleUrls: ['./catalogue-import.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CatalogueImportComponent extends UnsubscribeComponent implements OnInit {

  lottiesOptions: AnimationOptions = {
    path: 'assets/lotties/done.json',
    loop: false,
  }
  today = new Date();
  isEditable = true;
  workbook: WorkBook = {} as WorkBook;
  catalogueImports!: CatalogueImport.Entry[];
  importForm: Catalogue.CatalogueFileOptions = {
    user: '',
    fournisseur: '',
    date_catalogue: '',
    file: null,
    excel: {
      _id: undefined,
      isArrivage: false,
      feuille: '',
      designation: '',
      prix: '',
      date_expiration: '',
      tva: ''
    }
  }

  acceptedFileFormat = [
    ".xls",
    ".xlm",
    ".xlsx",
    ".csv"
  ]
  sheets: string[] = [];
  stepper: any;
  loading = false;
  isImporting = false;
  isAlreadyKnownCatalogue = false;
  savedParams: any;

  constructor(protected store: Store, private route: ActivatedRoute, private dateAdapter: DateAdapter<Date>) {
    super();
    this.today = new Date();
    this.today.setDate(this.today.getDate() + 3);
    this.route.paramMap.subscribe(params => {
      this.importForm.fournisseur = params.get('fournisseur') || '';
    });
    this.dateAdapter.setLocale('en-GB'); //dd/MM/yyyy
  }

  ngOnInit() {
    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(CatalogueSelector.selectLoading)
    ).subscribe(loading => {
      if (!loading && this.isImporting) {
        this.isImporting = false;
        this.stepper.next()
      }
    });
    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(CatalogueImportSelector.selectAll)
    ).subscribe(entries => {
        this.catalogueImports = [...entries];
    });
  }

  checkFile(event: any, stepper: any): void {
    this.importForm.file = event.target.files[0];

    const reader: FileReader = new FileReader();
    reader.readAsBinaryString(this.importForm.file);
    reader.onload = (e: any) => {
      /* create workbook */
      const binarystr: string = e.target.result;
      const wb: XLSX.WorkBook = XLSX.read(binarystr, { type: 'binary' });
      this.workbook = wb;
      this.sheets = wb.SheetNames;
      stepper.next();

      const importParams = this.catalogueImports.find(row => row.fournisseur === this.importForm.fournisseur);
      if (importParams) {
        this.isAlreadyKnownCatalogue = true;
        this.savedParams = {
          _id: importParams._id,
          isArrivage: importParams?.isArrivage || false,
          feuille: importParams.feuille,
          designation: importParams.designation,
          prix: importParams.prix,
          date_expiration: importParams.date_expiration,
          tva: importParams.tva
        };
        if (this.sheets.indexOf(this.savedParams.feuille) > -1) {
          stepper.next();
        } else {
          this.savedParams.feuille = '';
          this.importForm.excel.feuille = '';
        }
        this.onConfigChanged(this.savedParams);
      }
    };
  }

  reset(stepper: any): void {
    this.importForm = {
      user: '',
      file: '',
      fournisseur: this.importForm.fournisseur,
      date_catalogue: '',
      excel: {
        isArrivage: false,
        feuille: '',
        designation: '',
        prix: '',
        date_expiration: '',
        tva: ''
      }
    }
    stepper.reset();
  }

  onConfigChanged(options: any): void {
    Object.assign(this.importForm.excel, options);
  }

  sheetSelected(feuille: string, stepper: any): void {
    this.importForm.excel.feuille = feuille;
    this.savedParams = {...this.savedParams, feuille};
    stepper.next()
  }

  import(stepper: any): void {
    this.importForm.user = GET_ITEM_STORAGE('currentUserId');
    this.store.dispatch(CatalogueActions.CREATE_REQUESTED({
      input: this.importForm
    }));

    if (this.savedParams?._id) {
      const {_id: id, ...changes} = this.savedParams;
      this.store.dispatch(CatalogueImportActions.UPDATE_REQUESTED({ id, changes }));
    } else {
      this.store.dispatch(CatalogueImportActions.CREATE_REQUESTED({
        input: {
          ...this.importForm.excel,
          fournisseur: this.importForm.fournisseur
        }
      }));
    }
    this.isImporting = true;
    this.stepper = stepper;
  }
}
