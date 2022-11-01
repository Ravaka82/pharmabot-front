import {Component, EventEmitter, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.scss']
})
export class ChatInputComponent implements OnInit {

  message: any = '';

  @Output() submit = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  sendMessage(): void {
    this.submit.emit(this.message);
    this.message = '';
  }

}
