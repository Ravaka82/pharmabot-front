import { Injectable } from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {ModalConfirmationComponent} from "../../shared/component/modal-confirmation/modal-confirmation.component";

@Injectable({
  providedIn: 'root'
})
export class ModalConfirmationService {

  dialogRef!: MatDialogRef<any>;

  constructor(private dialog: MatDialog) { }

  openModal(config: MatDialogConfig): MatDialogRef<any> {
    this.dialogRef = this.dialog.open(ModalConfirmationComponent, config);
    return this.dialogRef;
  }
  closeModal(): void {
    this.dialogRef.close();
  }
}
