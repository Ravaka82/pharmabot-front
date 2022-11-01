import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

@Component({
  selector: 'app-chat-groupe-add',
  templateUrl: './chat-groupe-add.component.html',
  styleUrls: ['./chat-groupe-add.component.scss']
})
export class ChatGroupeAddComponent implements OnInit {

  lists: any = [];
  clonedLists: any = [];
  selected: any = [];
  groupName =  '';

  constructor(@Inject(MAT_DIALOG_DATA) private data: any, private dialogRef: MatDialogRef<any>) { }

  ngOnInit(): void {
    this.lists = [...this.data];
    this.clonedLists = [...this.lists];
  }

  onSelect(value: any): void {
    this.selected.push(value);
    this.lists = this.lists.filter((user: any) => user._id !== value._id);
  }

  onRemove(member: any): void {
    this.selected = this.selected.filter((selected: any) => selected._id !== member._id);
    this.lists.push(member);
    this.lists = [...this.lists]
  }

  onSearch(keyword: string): void {
    const selectedIds = this.selected.map((selected: any) => selected._id);
    this.lists = this.clonedLists.filter((user: any) => {
      return user.pseudo.toLowerCase().indexOf(keyword.toLocaleLowerCase()) > -1 && selectedIds.indexOf(user._id) < 0;
    });
  }

  onSubmit(): void {
    this.dialogRef.close({
      _id: String(new Date().valueOf()),
      pseudo: this.groupName,
      members: this.selected,
      previewMessage: '',
      createdAt: new Date()
    })
  }
}
