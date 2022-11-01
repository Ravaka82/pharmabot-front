import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ChatGroupeAddComponent} from "./chat-groupe-add/chat-groupe-add.component";

@Component({
  selector: 'app-chat-groupe',
  templateUrl: './chat-groupe.component.html',
  styleUrls: ['./chat-groupe.component.scss']
})
export class ChatGroupeComponent implements OnInit {

  @Input() groupes: any = [];
  @Input() users: any = [];

  @Output() newGroupe = new EventEmitter();

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  addGroupe(): void {
    const dialogRef = this.dialog.open(ChatGroupeAddComponent, {
      data: [...this.groupes, ...this.users],
      width: '60%'
    });

    dialogRef.afterClosed().subscribe(groupe => {
      if (groupe) {
        this.newGroupe.emit(groupe)
      }
    })
  }

}
