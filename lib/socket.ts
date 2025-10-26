import { Server as SocketIOServer } from 'socket.io';
import { Server as NetServer } from 'http';
import { NextApiResponse } from 'next';
import db from '@/lib/prisma';

export interface NextApiResponseServerIO extends NextApiResponse {
  socket: any & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
}

export const ioHandler = async (req: any, res: NextApiResponseServerIO) => {
  if (!res.socket.server.io) {
    console.log('Setting up Socket.IO server...');
    
    const io = new SocketIOServer(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
      cors: {
        origin: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
        methods: ['GET', 'POST'],
      },
    });

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id);

      // Handle admin status change
      socket.on('admin_status_change', async (status) => {
        try {
          // In a real app, you'd get the admin ID from the session
          // For now, we'll use a placeholder
          console.log('Admin status changed to:', status);
          
          io.emit('admin_status', status);
        } catch (error) {
          console.error('Error updating admin status:', error);
        }
      });

      // Handle new messages
      socket.on('message', async (data) => {
        try {
          const { content, senderType, chatId, senderId } = data;
          
          const message = await db.message.create({
            data: {
              content,
              senderType,
              chatId,
              senderId: senderId || null,
            },
          });

          // Update chat's lastMessageAt
          await db.chat.update({
            where: { id: chatId },
            data: { lastMessageAt: new Date() },
          });

          io.emit('message', message);
        } catch (error) {
          console.error('Error saving message:', error);
        }
      });

      // Handle typing indicators
      socket.on('customer_typing', async (data) => {
        try {
          const { chatId, isTyping } = data;
          
          await db.chat.update({
            where: { id: chatId },
            data: { isCustomerTyping: isTyping },
          });

          socket.broadcast.emit('customer_typing', { chatId, isTyping });
        } catch (error) {
          console.error('Error updating typing status:', error);
        }
      });

      socket.on('admin_typing', async (data) => {
        try {
          const { chatId, isTyping } = data;
          
          await db.chat.update({
            where: { id: chatId },
            data: { isAdminTyping: isTyping },
          });

          socket.broadcast.emit('admin_typing', { chatId, isTyping });
        } catch (error) {
          console.error('Error updating typing status:', error);
        }
      });

      // Handle new chat requests
      socket.on('new_chat_request', (request) => {
        socket.broadcast.emit('new_chat_request', request);
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id);
      });
    });

    res.socket.server.io = io;
  }

  res.end();
};














