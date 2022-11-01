import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Client} from "../../../@core/interfaces";
import {ClientActions} from "../../../@core/store/actions";
import {UnsubscribeComponent} from "../../../shared/component/unsubscribe/unsubscribe.component";
import {select, Store} from "@ngrx/store";
import {AnimationOptions} from "ngx-lottie";
import {takeUntil} from "rxjs/operators";
import {ClientSelector, UserSelector} from "../../../@core/store/selectors";
import {MatDialog} from "@angular/material/dialog";
import {ModalSuccessComponent} from "../../../shared/component/modal-success/modal-success.component";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-client-view-edit',
  templateUrl: './client-view-edit.component.html',
  styleUrls: ['./client-view-edit.component.scss']
})
export class ClientViewEditComponent extends UnsubscribeComponent implements OnInit {

  clientForm: FormGroup = {} as FormGroup;
  loading: boolean = false;
  submitting: boolean = false;
  isUpdate = false;
  errorMessage: string = '';
  clientId: string = '';

  options: AnimationOptions = {
    path: '/assets/lotties/paper.json',
    loop: false,

  };

  constructor(protected store: Store, private modal: MatDialog, private router: Router, private route: ActivatedRoute) {
    super()
    this.route.paramMap.subscribe(params => {
      this.clientId = params.get('clientId') || '';
      this.isUpdate = !(this.clientId === 'new');
    })
  }

  ngOnInit(): void {
    this.initForm();

    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(ClientSelector.selectState)
    ).subscribe(({loading, errorMessage, entities}) => {
      if (this.clientId && entities && entities[this.clientId]) {
        this.clientForm.patchValue({...entities[this.clientId]});
      }
      this.loading = loading;
      if (!loading && this.submitting) {
        if (errorMessage) {
          this.errorMessage = `⚠️ ${errorMessage}`
          this.clientForm.enable();
        } else {
          const successModal = this.modal.open(ModalSuccessComponent, {
            data: `<p>Le client <b>${this.clientForm.get('name')?.value}</b> a été ${ this.isUpdate ? 'mis à jour' : 'ajouté'}.</p>`,
          });
          successModal.afterClosed().subscribe(() => {
            this.router.navigateByUrl('/clients');
          })
        }
        this.submitting = false;
      }
    });
  }

  initForm(): void {
    this.clientForm = new FormGroup({
      name: new FormControl('', [Validators.required]),
      address: new FormControl('', [Validators.required]),
      city: new FormControl('', [Validators.required]),
      zip: new FormControl('', [Validators.required]),
      country: new FormControl('', [Validators.required]),
      nif: new FormControl('', []),
      stat: new FormControl('', []),
      rcs: new FormControl('', []),
      phoneNumber: new FormControl('', []),
      officeNumber: new FormControl('', [Validators.required]),
    });
  }

  submit(): void {
    this.errorMessage = '';
    this.clientForm.disable();
    this.submitting = true;

    if (this.isUpdate) {
      const changes = this.clientForm.value as Client.UpdateInput;
      this.store.dispatch(ClientActions.UPDATE_REQUESTED({
        id: this.clientId,
        changes
      }))
    } else {
      this.store.dispatch(ClientActions.CREATE_REQUESTED({
        input: this.clientForm.value as Client.CreateInput
      }))
    }
  }
}
