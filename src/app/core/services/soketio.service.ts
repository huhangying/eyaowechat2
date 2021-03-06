import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { environment } from '../../../environments/environment';
import * as moment from 'moment';
import { Chat } from 'src/app/models/chat.model';
import { UserFeedback } from 'src/app/models/user-feedback.model';
import { OriginBooking } from 'src/app/models/booking.model';
import { Consult } from 'src/app/models/consult/consult.model';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  socket: SocketIOClient.Socket;

  constructor() { }

  setupSocketConnection() {
    if (!this.socket) {
      this.socket = io(environment.socketUrl);
    }
  }

  joinRoom(room: string) {
    this.socket.emit('joinRoom', room);
    this.socket?.on('disconnect', (reason: string) => {
      if (reason === 'io server disconnect') {
        // the disconnection was initiated by the server, you need to reconnect manually
        this.socket.connect();
      }
      // else the socket will automatically try to reconnect
    });
  }

  leaveRoom(room: string) {
    this.socket.emit('leaveRoom', room);
    this.socket?.disconnect();
  }

  // Chat
  onChat(next) {
    this.socket.on('chat', next);
  }

  sendChat(room: string, chat: Chat) {
    // 区分 chat 和 客服消息
    this.socket.emit(!chat.cs ? 'chat' : 'customerService', room, {
      ...chat,
      created: moment()
    });
  }

  // Feedback
  onFeedback(next) {
    this.socket.on('feedback', next);
  }

  sendFeedback(room: string, feedback: UserFeedback) {
    this.socket.emit('feedback', room, {
      ...feedback,
      createdAt: moment()
    });
  }

  // Booking
  onBooking(next) {
    this.socket.on('booking', next);
  }

  sendBooking(room: string, originBooking: OriginBooking, username: string) {
    // convert OriginBooking to Booking
    const booking = {
      ...originBooking,
      user: {
        _id: originBooking._id,
        name: username
      },
      created: moment()
    }
    this.socket.emit('booking', room, booking);
  }

  // Consult
  onConsult(next) {
    this.socket.on('consult', next);
  }

  sendConsult(room: string, consult: Consult) {
    this.socket.emit('consult', room, {
      ...consult,
      createdAt: moment()
    });
  }

}
