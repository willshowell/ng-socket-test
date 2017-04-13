import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

import { Chat } from './chat.model';

@Injectable()
export class ChatService {

  constructor(private http: Http) { }

  getChatMessagesByRoom(room: string): Observable<Chat[]> {
    return this.http.get('/chat/' + room)
      .map(res => res.json())
      .map(res => res.map(chat => {
          chat.type = 'message';
          return chat;
        })
      );
  }

  sendChatMessage(data: Chat): Observable<Chat> {
    return this.http.post('/chat', data)
      .map(res => res.json())
      .map(chat => {
        chat.type = 'message';
        return chat;
      });
  }

}
