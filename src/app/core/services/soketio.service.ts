import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import { Chat } from 'src/app/models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket: SocketIOClient.Socket;

  constructor() { }

  setupSocketConnection() {
    if (!this.socket) {
      this.socket = io(environment.socketUrl);
      // this.socket.emit('chat', 'Hello there from Angular.'); // test
    }
  }

  onChat(next) {
    this.socket.on('chat', next);
  }

  onRoom(room, next) {
    this.socket.on(room, next);
  }

  joinRoom(room: string) {
    this.socket.emit('joinRoom', room);
  }

  leaveRoom(room: string) {
    this.socket.emit('leaveRoom', room);
  }

  sendChat(room: string, chat: Chat) {
    this.socket.emit('chat', room, {
      ...chat,
      created: moment()
    });
  }

  sendFeedback(type: number, doctor: string, user: string) {
    this.socket.emit('feedback', {
      type: type,
      user: user,
      to: doctor,
      created: moment()
    });

  }

}
