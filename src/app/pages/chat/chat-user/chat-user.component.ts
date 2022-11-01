import {AfterViewInit, Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-chat-user',
  templateUrl: './chat-user.component.html',
  styleUrls: ['./chat-user.component.scss']
})
export class ChatUserComponent implements OnInit, AfterViewInit {

  user = { _id: 'duroi3', pseudo: 'Duroi 3', cssClass: 'my-message' };
  replyUser = { _id: 'duroi1', pseudo: 'Duroi 1', cssClass: 'reply-message' };
  userMap: any = {
    'duroi3': { _id: 'duroi3', pseudo: 'Duroi 3', cssClass: 'my-message' },
    'duroi1': { _id: 'duroi1', pseudo: 'Duroi 1', cssClass: 'reply-message' }
  }
  showDeletedMessage = false;

  messages = [
    { _id: 'msg1', type: 'text', content: 'Hello ça va?', user: 'duroi1', to: 'duroi3', createdAt: new Date(), isDeleted: false },
    { _id: 'msg2', type: 'text', content: 'Oui oui et toi?', user: 'duroi3', to: 'duroi1', createdAt: new Date(), isDeleted: false },
    { _id: 'msg3', type: 'text', content: 'Bien merci 🔥', user: 'duroi1', to: 'duroi3', createdAt: new Date(), isDeleted: false },
    { _id: 'msg4', type: 'text', content: 'Comment va le boulot? 😄😄😄', user: 'duroi1', to: 'duroi3', createdAt: new Date(), isDeleted: false },
    { _id: 'msg5', type: 'text', content: 'C est graaaaave !!!!!', user: 'duroi3', to: 'duroi1', createdAt: new Date(), isDeleted: false }
  ]

  messageViews: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.messageViews = this.formatMessages(this.messages);
    this.updateView();
  }

  ngAfterViewInit(): void {
    this.scrollToBottom();
  }

  formatMessages(messages: any[]): any[] {
    return messages.map(message => {
      const msg: any = { ...message };
      msg.user = typeof msg.user === 'string' ? this.userMap[msg.user] : msg.user;
      msg.to = typeof msg.to === 'string' ? this.userMap[msg.to] : msg.to;

      const isMe = msg.user._id === this.user._id;
      msg.cssClass = isMe ? this.user.cssClass : this.replyUser.cssClass;
      msg.isMe = isMe;
      return msg;
    })
  }

  deleteMessage(id: string): void {
     this.messages = this.messages.map((message: any) => {
       if (message._id === id) {
         return { ...message, isDeleted: true }
       }
       return message;
     });
     const messages = this.messages.filter((message: any) => !message.isDeleted);
     this.messageViews = this.formatMessages(messages);
     this.updateView();
  }

  onNewMessage(message: string): void {
    const newMessage = {
      _id: String(new Date().valueOf()),
      type: 'text',
      content: message,
      user: this.userMap[this.user._id],
      to: this.userMap[this.replyUser._id],
      createdAt: new Date(),
      isDeleted: false
    };
    this.messages.push(newMessage);
    this.messageViews = this.formatMessages(this.messages);
    this.updateView();
    setTimeout(this.scrollToBottom)
  }

  scrollToBottom(): void {
    const $chatMessageContainer = document.querySelector('#chat-user-body');
    const scrollHeight = $chatMessageContainer?.scrollHeight;
    $chatMessageContainer?.scrollTo({ behavior: 'smooth', top: scrollHeight })
  }

  onShowDeletedMessage(): void {
    this.showDeletedMessage = !this.showDeletedMessage;
    this.updateView();
  }

  updateView(): void {
    const allMessages = [...this.messages];
    const undeletedMessages = allMessages.filter((message: any) => !message.isDeleted);
    const messages = this.showDeletedMessage ? allMessages : undeletedMessages;
    this.messageViews = this.formatMessages(messages);
  }

}
