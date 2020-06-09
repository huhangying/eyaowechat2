import { Injectable } from '@angular/core';
import { ApiService } from '../core/services/api.service';
import { Chat } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(
    private api: ApiService,
  ) { }

  getChatHistory(sender: string, to: string) {
    return this.api.get<Chat[]>(`chats/history/${sender}/${to}`);
  }

  sendChat(data: Chat) {
    return this.api.post<Chat>('chat/send', data);
  }

  // unread list
  getUnreadListByPatient(patientId: string) {
    return this.api.get<Chat[]>(`chats/unread/user/${patientId}`);
  }

}
