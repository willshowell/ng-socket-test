import { Component, OnInit } from '@angular/core';
import * as io from 'socket.io-client';

import { ChatService } from '../chat.service';
import { Chat } from '../chat.model';

interface Session {
  username: string;
  room: string;
}

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  chats: Chat[] = [];
  socket: any;
  username: string;
  room: string;

  text = '';

  joinRoomForm = { username: '', room: '' };

  constructor(private chatService: ChatService) {
    this.socket = io('http://localhost:4000');
  }

  /** The saved session */
  set session(session: Session) {
    localStorage.setItem('session', JSON.stringify(session));
  }
  get session(): Session {
    return JSON.parse(localStorage.getItem('session'));
  }

  ngOnInit() {
    // Get user and room
    const session = this.session;

    if (session) {
      this.username = session.username;
      this.room = session.room;

      this.chatService
        .getChatMessagesByRoom(session.room)
        .subscribe(chats => this.chats = chats);
    }

    this.socket.on('new-message', message => {
      if (message.room === this.room) {
        this.chats.push(message);
      }
    });

    this.socket.on('user-joined', data => {
      if (data.room === this.room) {
        this.chats.push({
          room: data.room,
          username: data.username,
          text: 'has joined the room',
          type: 'meta'
        });
      }
    });

    this.socket.on('user-left', data => {
      if (data.room === this.room) {
        this.chats.push({
          room: data.room,
          username: data.username,
          text: 'has left the room',
          type: 'meta'
        });
      }
    });
  }

  joinRoom() {
    this.session = this.joinRoomForm;
    this.username = this.joinRoomForm.username;
    this.room = this.joinRoomForm.room;

    this.chatService
      .getChatMessagesByRoom(this.joinRoomForm.room)
      .subscribe(chats => this.chats = chats);

    this.socket.emit('user-joined', {
      room: this.joinRoomForm.room,
      username: this.joinRoomForm.username
    });
  }

  sendMessage(text: string) {
    const chat = {
      username: this.username,
      room: this.room,
      text: text
    };

    this.text = '';

    this.chatService
      .sendChatMessage(chat)
      .subscribe(message => this.socket.emit('new-message', message));
  }

  logout() {
    this.socket.emit('user-left', {
      room: this.room,
      username: this.username
    });

    this.chats = [];
    this.session = null;
    this.username = null;
    this.room = null;
  }

}
