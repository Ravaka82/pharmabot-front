import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { select, Store } from '@ngrx/store';
import { AnimationOptions } from 'ngx-lottie';
import {UnsubscribeComponent} from "../../../shared/component/unsubscribe/unsubscribe.component";
import {filter, takeUntil} from "rxjs/operators";
import { ModalSuccessComponent } from 'src/app/shared/component/modal-success/modal-success.component';
import { ArchiveSelector, BonDeCommandeSelector, FournisseurSelector } from 'src/app/@core/store/selectors';
import { Archive, BonDeCommande, Fournisseur } from 'src/app/@core/interfaces';
import { BonDeCommandeActions } from 'src/app/@core/store/actions';
import {combineLatest} from "rxjs";
@Component({
  selector: 'app-bon-de-commande-view-edit',
  templateUrl: './bon-de-commande-view-edit.component.html',
  styleUrls: ['./bon-de-commande-view-edit.component.scss']
})
export class BonDeCommandeViewEditComponent  extends UnsubscribeComponent implements OnInit {

  bonDeCommandeForm: FormGroup = {} as FormGroup;
  loading: boolean = false;
  submitting: boolean = false;
  isUpdate = false;
  errorMessage: string = '';
  bonDeCommandeId: string = '';
  fournisseurs: Fournisseur.Entry[]=[];
  archives : Archive.Entry[]=[];


  options: AnimationOptions = {
    path: '/assets/lotties/paper.json',
    loop: false,

  };
  
  constructor(protected store: Store, private modal: MatDialog, private router: Router, private route: ActivatedRoute) {
    super()
    this.route.paramMap.subscribe(params => {
      this.bonDeCommandeId = params.get('bonDeCommandeId') || '';
      this.isUpdate = !(this.bonDeCommandeId === 'new');
    })
  }

  ngOnInit(): void {
    this.initForm();

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(BonDeCommandeSelector.selectState)
    ).subscribe(({loading, errorMessage, entities}) => {
      if (this.bonDeCommandeId && entities && entities[this.bonDeCommandeId]) {
        this.bonDeCommandeForm.patchValue({...entities[this.bonDeCommandeId]});
      }
      this.loading = loading;
      if (!loading && this.submitting) {
        if (errorMessage) {
          this.errorMessage = `⚠️ ${errorMessage}`
          this.bonDeCommandeForm.enable();
        } else {
          const successModal = this.modal.open(ModalSuccessComponent, {
            data: `<p>Le client <b>${this.bonDeCommandeForm.get('name')?.value}</b> a été ${ this.isUpdate ? 'mis à jour' : 'ajouté'}.</p>`,
          });
          successModal.afterClosed().subscribe(() => {
            this.router.navigateByUrl('/bon-de-commande');
          })
        }
        this.submitting = false;
      }
    });
    // combineLatest([
    //   this.store.select(FournisseurSelector.selectAll),
    //   this.store.select(ArchiveSelector.selectAll)
    // ]).pipe(
    //   takeUntil(super.unsubscribe()),
    //   filter(([fournisseur, archive]) => !!fournisseur && !!archive)
    // ).subscribe(([fournisseur, archive]) => {
    //   this.fournisseurs = (fournisseur && [...fournisseur]) || [];
    //   this.archives = (archive && [...archive]) || [];
    // });
  }

  initForm(): void {
    this.bonDeCommandeForm = new FormGroup({
      fournisseur: new FormControl('', [Validators.required]),
      designation: new FormControl('', [Validators.required]),
      archive: new FormControl('', [Validators.required]),
    });
  }

  submit(): void {
    this.errorMessage = '';
    this.bonDeCommandeForm.disable();
    this.submitting = true;

    if (this.isUpdate) {
      const changes = this.bonDeCommandeForm.value as BonDeCommande.UpdateBonDeCommandeInput;
      this.store.dispatch(BonDeCommandeActions.UPDATE_REQUESTED({
        id: this.bonDeCommandeId,
        changes
      }))
    } else {
      this.store.dispatch(BonDeCommandeActions.CREATE_REQUESTED({
        input: this.bonDeCommandeForm.value as BonDeCommande.AddBonDeCommandeInput
      }))
    }
  }
}
