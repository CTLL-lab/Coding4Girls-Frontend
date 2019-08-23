import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { apiURL } from 'src/app/config';

@Injectable({ providedIn: 'root' })
export class SocketioService {
  public socket: SocketIOClient.Socket = io(apiURL.replace('http', 'ws'), {
    transports: ['websocket'],
    reconnectionDelay: 500,
    reconnectionAttempts: 10
  });
}
