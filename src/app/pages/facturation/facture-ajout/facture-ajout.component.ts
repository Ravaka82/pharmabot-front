import {Component, OnInit} from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {AnimationOptions} from "ngx-lottie";
import {select, Store} from "@ngrx/store";
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {takeUntil} from "rxjs/operators";
import {CatalogueGroupeSelector, ClientSelector, FactureSelector} from "../../../@core/store/selectors";
import {ModalSuccessComponent} from "../../../shared/component/modal-success/modal-success.component";
import {FactureActions} from "../../../@core/store/actions";
import {UnsubscribeComponent} from "../../../shared/component/unsubscribe/unsubscribe.component";
import {CatalogueGroupe, Client, Facture} from "../../../@core/interfaces"
import {get as _get, cloneDeep as _cloneDeep} from 'lodash';
import {MaskApplierService} from "ngx-mask";

@Component({
  selector: 'app-facture-ajout',
  templateUrl: './facture-ajout.component.html',
  styleUrls: ['./facture-ajout.component.scss']
})
export class FactureAjoutComponent extends UnsubscribeComponent implements OnInit {
  factureForm: FormGroup = {} as FormGroup;
  loading: boolean = false;
  submitting: boolean = false;
  errorMessage: string = '';
  clientId: string = '';
  items: FormArray = {} as FormArray;
  total = 0;
  clients: Client.Entry[] = [];
  catalogueGroupes: CatalogueGroupe.Entry[] = [];

  options: AnimationOptions = {
    path: '/assets/lotties/bills.json',
    loop: true,

  };

  constructor(
    protected store: Store,
    private modal: MatDialog,
    private router: Router,
    private formBuilder: FormBuilder,
    private mask: MaskApplierService
  ) {
    super()
  }

  ngOnInit(): void {
    this.initForm();

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(CatalogueGroupeSelector.selectAll)
    ).subscribe(catalogueGroupes => {
      this.catalogueGroupes = catalogueGroupes;
    })

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(ClientSelector.selectAll)
    ).subscribe(clients => {
      this.clients = clients;
    })

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(FactureSelector.selectState)
    ).subscribe(({loading, errorMessage}) => {
      this.loading = loading;
      if (!loading && this.submitting) {
        if (errorMessage) {
          this.errorMessage = `⚠️ ${errorMessage}`
          this.factureForm.enable();
        } else {
          const ref = this.factureForm.get('reference')?.value;
          const successModal = this.modal.open(ModalSuccessComponent, {
            data: `<p>La facture <b>${this.mask.applyMask(ref, 'SSS/0000/0*')}</b> a été créé.</p>`,
          });
          successModal.afterClosed().subscribe(() => {
            this.router.navigateByUrl('/facturation');
          })
        }
        this.submitting = false;
      }
    });
  }

  initForm(): void {
    this.factureForm = this.formBuilder.group({
      reference: new FormControl('', [Validators.required]),
      sender: new FormControl('', [Validators.required]),
      receiver: new FormControl('', [Validators.required]),
      catalogueGroupe: new FormControl('', [Validators.required]),
      facturation: this.formBuilder.array([])
    });
  }

  addFacturationFormGroup(): FormGroup {
    return this.formBuilder.group({
      designation: new FormControl('', [Validators.required]),
      quantity: new FormControl('', [Validators.required]),
      price: new FormControl('', [Validators.required]),
    })
  }

  submit(): void {
    this.errorMessage = '';
    this.factureForm.disable();
    this.submitting = true;

    const input = _cloneDeep(this.factureForm.value);
    input.status = 'CREATED'

    delete input.sender._id;
    delete input.sender.createdAt;
    delete input.sender.updatedAt;
    delete input.sender.__typename;

    delete input.receiver._id;
    delete input.receiver.createdAt;
    delete input.receiver.updatedAt;
    delete input.receiver.__typename;


    this.store.dispatch(FactureActions.CREATE_REQUESTED({ input }))
  }

  addItem(): void {
    this.items = this.factureForm.get('facturation') as FormArray;
    this.items.push(this.addFacturationFormGroup())
  }

  deleteItem(index: number): void {
    this.items = this.factureForm.get('facturation') as FormArray;
    this.items.controls.splice(index, 1);
    this.items.value.splice(index, 1);
    this.elementChange();
  }

  elementChange(): void {
    let total = 0;
    const facturations = this.items.value;
    for (const facturation of facturations) {
      const quantity = _get(facturation, ['quantity'], 0);
      const price = _get(facturation, ['price'], 0);
      total +=  quantity * price;
    }
    this.total = total;
  }
}
