import {Component, Inject, OnInit} from '@angular/core';
import {AnimationOptions} from "ngx-lottie";
import {MAT_DIALOG_DATA} from "@angular/material/dialog";

@Component({
  selector: 'app-modal-success',
  templateUrl: './modal-success.component.html',
  styleUrls: ['./modal-success.component.scss']
})
export class ModalSuccessComponent implements OnInit {

  lottiesOptions: AnimationOptions = {
    path: 'assets/lotties/done.json',
    loop: false,
  }

  constructor(@Inject(MAT_DIALOG_DATA) public message: any) { }

  ngOnInit(): void {
  }
}
