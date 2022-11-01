import { Component, OnInit } from '@angular/core';
import { ViewChild, ViewEncapsulation, Inject } from '@angular/core';
import { EmitType, detach } from '@syncfusion/ej2-base';
import { UploaderComponent, RemovingEventArgs } from '@syncfusion/ej2-angular-inputs';
import { createSpinner, showSpinner, hideSpinner } from '@syncfusion/ej2-popups';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { DateAdapter } from '@angular/material/core';
import { Store } from '@ngrx/store';
import { ModalConfirmationService } from 'src/app/@core/services/modal-confirmation.service';
import { Router } from '@angular/router';
import { BonDeCommandeActions } from 'src/app/@core/store/actions';

@Component({
  selector: 'app-panier-upload',
  templateUrl: './panier-upload.component.html',
  styleUrls: ['./panier-upload.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PanierUploadComponent implements OnInit {
  nomForm: FormGroup = {} as FormGroup;
  submitting: boolean = false;
  fileSource: any;
  name!: '';
  constructor
  (
   private modalRef: MatDialog,
   private _adapter: DateAdapter<any>,
   protected store: Store,
   private modalConfirmation: ModalConfirmationService,
   private router: Router
  ) {
  }
  ngOnInit(): void {
    this.initForm();
  }
  initForm(): void {
    this.nomForm = new FormGroup({
      to: new FormControl('', [Validators.required]),
      subject: new FormControl('', [Validators.required]),
      text: new FormControl('', [Validators.required]),
      file: new FormControl('', [Validators.required]),
    })};
    onFileChange(event:any) {
      if (event.target.files.length > 0) {
        const file = event.target.files[0];
        this.name = event.target.files[0].name;
        this.nomForm.patchValue({
         file,
        });
      }
    }
onSubmit(){
  const to = this.nomForm.get("to")?.value;
  const subject = this.nomForm.get("subject")?.value;
  const text = this.nomForm.get("text")?.value;
  const file = this.nomForm.get("file")?.value;
  const f = this.name;
  const filename = f.split('.').slice(0, -1).join('.');
  this.submitting = true;
  this.store.dispatch(BonDeCommandeActions.LOAD_REQUESTED({
    to,subject,text,file,filename
  }))
  this.submitting = false;
  this.modalConfirmation.openModal({
    data: {
      lottie: 'assets/lotties/notification.json',
      showConfirm: true,
      confirmLabel: 'OK',
      title: 'Notification',
      content: `message envoyé avec succes <img src="assets/svg/ok.png" alt="Bouton d'export excel" width="30">`
    }
  });
}
}
