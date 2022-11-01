import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-chat-pharmabooker',
  templateUrl: './chat-pharmabooker.component.html',
  styleUrls: ['./chat-pharmabooker.component.scss']
})
export class ChatPharmabookerComponent implements OnInit {

  @Input() users: any = [];

  constructor() { }

  ngOnInit(): void {
  }

}
