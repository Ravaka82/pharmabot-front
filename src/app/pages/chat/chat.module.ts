import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatComponent } from './chat.component';
import {ChatRoutingModule} from "./chat-routing.module";
import { ChatListComponent } from './chat-list/chat-list.component';
import { ChatUserComponent } from './chat-user/chat-user.component';
import {SharedModule} from "../../shared/shared.module";
import { ChatInputComponent } from './chat-user/chat-input/chat-input.component';
import { ChatPharmabookerComponent } from './chat-list/chat-pharmabooker/chat-pharmabooker.component';
import { ChatGroupeComponent } from './chat-list/chat-groupe/chat-groupe.component';
import { ChatGroupeAddComponent } from './chat-list/chat-groupe/chat-groupe-add/chat-groupe-add.component';

@NgModule({
  declarations: [
    ChatComponent,
    ChatListComponent,
    ChatUserComponent,
    ChatInputComponent,
    ChatPharmabookerComponent,
    ChatGroupeComponent,
    ChatGroupeAddComponent
  ],
  imports: [
    CommonModule,
    ChatRoutingModule,
    SharedModule
  ]
})
export class ChatModule { }
