import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { Injectable, Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*', // Adjust this for production
  },
})
@Injectable()
export class NotificationGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server!: Server;

  private readonly logger = new Logger(NotificationGateway.name);

  // Map of userId to array of socketIds to support multiple tabs/devices per user
  private userSockets: Map<string, Set<string>> = new Map();

  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const authHeader = client.handshake.headers.authorization;
      let token = authHeader?.split(' ')[1];
      
      if (!token && client.handshake.query?.token) {
        token = client.handshake.query.token as string;
      }
      if (!token && client.handshake.auth?.token) {
        token = client.handshake.auth.token;
      }

      if (!token) {
        this.logger.warn(`Client ${client.id} tried to connect without token`);
        client.disconnect();
        return;
      }

      const decoded = this.jwtService.verify(token);
      const userId = decoded._id || decoded.sub;
      
      client.data.user = decoded;

      if (!this.userSockets.has(userId)) {
        this.userSockets.set(userId, new Set());
      }
      this.userSockets.get(userId)?.add(client.id);

      this.logger.log(`Client ${client.id} connected for user ${userId}`);
    } catch (e) {
      this.logger.error(`Authentication failed for client ${client.id}`, e);
      client.disconnect();
    }
  }

  handleDisconnect(client: Socket) {
    if (client.data?.user) {
      const userId = client.data.user._id || client.data.user.sub;
      const userSockets = this.userSockets.get(userId);
      if (userSockets) {
        userSockets.delete(client.id);
        if (userSockets.size === 0) {
          this.userSockets.delete(userId);
        }
      }
    }
    this.logger.log(`Client ${client.id} disconnected`);
  }

  /**
   * Broadcasts a notification to a specific user
   */
  sendNotificationToUser(userId: string, notification: any) {
    const userSockets = this.userSockets.get(userId);
    if (userSockets) {
      userSockets.forEach((socketId) => {
        this.server.to(socketId).emit('new_notification', notification);
      });
    }
  }
}
