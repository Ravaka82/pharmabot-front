import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {EntriesSearch} from "../../../utils";

@Component({
  selector: 'app-chat-list',
  templateUrl: './chat-list.component.html',
  styleUrls: ['./chat-list.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ChatListComponent implements OnInit {

  users = [
    { _id: 'duroi3', pseudo: 'Duroi 3', previewMessage: 'ça marche !', createdAt: new Date(), color: 'text-success' },
    { _id: 'duroi2', pseudo: 'Duroi 2', previewMessage: 'Ok', createdAt: new Date(), color: 'text-danger'},
    { _id: 'harysoa1', pseudo: 'Hary Soa 1', previewMessage: 'Mba afaka jerena ve ito azafady', createdAt: new Date(), color: 'text-danger'},
    { _id: 'harysoa2', pseudo: 'Hary Soa 2', previewMessage: 'Mety zany. Misaotra indrindra', createdAt: new Date(), color: 'text-success'}
  ]

  groupes = [
    {
      _id: 'duroi',
      pseudo: 'Pharmacie DU ROI',
      previewMessage: 'ça marche !',
      createdAt: new Date(),
      members: [
        { pseudo: 'Duroi 3' },
        { pseudo: 'Duroi 2' },
        { pseudo: 'Duroi 1' },
      ]
    },
    {
      _id: 'harysoa',
      pseudo: 'Pharmacie HARY SOA',
      previewMessage: 'Ok',
      createdAt: new Date(),
      members: [
        { pseudo: 'Hary Soa 1' },
        { pseudo: 'Hary Soa 2' },
        { pseudo: 'Hary Soa 3' },
      ]
    }
  ];

  searchGroupes!: EntriesSearch<any>;
  searchUsers!: EntriesSearch<any>;

  constructor() { }

  ngOnInit(): void {
    this.init();
  }

  init(): void {
    this.searchGroupes = new EntriesSearch([...this.groupes]).setColumns(['pseudo', 'previewMessage']);
    this.searchUsers = new EntriesSearch([...this.users]).setColumns(['pseudo', 'previewMessage']);
  }

  onSearch(keyword: string): void {
    this.users = this.searchUsers.search(keyword);
    this.groupes = this.searchGroupes.search(keyword);
  }

  onNewGroupe(groupe: any): void {
    this.groupes.push(groupe);
    this.init();
  }

}
