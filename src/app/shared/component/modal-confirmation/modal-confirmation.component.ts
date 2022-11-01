import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {IConfirmationDialog} from "../../../@core/interfaces/confirmation-dialog.interface";
import {AnimationOptions} from "ngx-lottie";

@Component({
  selector: 'app-modal-confirmation',
  templateUrl: './modal-confirmation.component.html',
  styleUrls: ['./modal-confirmation.component.scss']
})
export class ModalConfirmationComponent implements OnInit {

  lottieOption: AnimationOptions = {}

  constructor(@Inject(MAT_DIALOG_DATA) public data: IConfirmationDialog, private dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
      this.lottieOption = {
        path: this.data.lottie,
        loop: false,
      }

    this.data.confirmLabel ??= 'Supprimer';
    this.data.cancelLabel ??= 'Annuler';
  }

  onCancel(): void {
    if (typeof this.data.onCancel === 'function') {
      this.data.onCancel(this.data, this.dialogRef);
    } else {
      this.dialogRef.close();
    }
  }

  onConfirm(): void {
    if (typeof this.data.onConfirm === 'function') {
      this.data.onConfirm(this.data, this.dialogRef);
    } else {
      this.dialogRef.close();
    }
  }

}
