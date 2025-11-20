import { Logger, UseGuards } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { envs } from 'src/config/envs';
import { WsJwtAuthGuard } from '../guards/web-socket-jwt-auth.guard';

@WebSocketGateway({
  cors: {
    origin: envs.FRONTEND_URL,
    credentials: true,
  },
  namespace: '/chat',
})
@UseGuards(WsJwtAuthGuard)
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(ChatGateway.name);

  async handleConnection(client: Socket) {
    this.logger.log(`Client attempting to connect: ${client.id}`);
    // Authentication happens automatically through WsJwtGuard
  }

  handleDisconnect(client: Socket) {
    const user = client.data.user;
    this.logger.log(
      `Client disconnected: ${client.id}${user ? ` (User: ${user.id})` : ''}`,
    );
  }

  @SubscribeMessage('sendMessage')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    //  Access authenticated user from socket.data
    const user = client.data.user;

    this.logger.log(`User ${user.id} sent message: ${data.message}`);

    // Your message handling logic
    return {
      event: 'messageReceived',
      data: {
        userId: user.id,
        message: data.message,
        timestamp: new Date(),
      },
    };
  }

  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody('roomId') roomId: string,
  ) {
    const user = client.data.user;

    client.join(roomId);
    this.logger.log(`User ${user.id} joined room ${roomId}`);

    this.server.to(roomId).emit('userJoined', {
      userId: user.id,
      roomId,
    });
  }
}
