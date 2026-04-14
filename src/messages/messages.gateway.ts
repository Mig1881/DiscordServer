import { WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class MessagesGateway {
  @WebSocketServer()
  server!: Server;

  broadcastNewMessage(channelId: string, message: any) {
    this.server.emit(`newMessage-${channelId}`, message);
  }
}