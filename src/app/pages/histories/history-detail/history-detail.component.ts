import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {History} from "../../../@core/interfaces";
import {AnimationOptions} from "ngx-lottie";

@Component({
  selector: 'app-history-detail',
  templateUrl: './history-detail.component.html',
  styleUrls: ['./history-detail.component.scss']
})
export class HistoryDetailComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: History.Entry ) { }

  ngOnInit(): void {
  }

}
