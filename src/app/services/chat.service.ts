import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { AppStoreService } from '../core/store/app-store.service';
import { Chat } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private api: ApiService,
    private appStore: AppStoreService,
  ) { }

  getChatHistory(sender: string, to: string) {
    return this.api.get<Chat[]>(`chats/history/${sender}/${to}`);
  }
}
