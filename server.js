const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const { Server } = require('socket.io');

const dev = process.env.NODE_ENV !== 'production';
const hostname = 'localhost';
const port = process.env.PORT || 3000;

// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handle);

  const io = new Server(httpServer, {
    path: '/api/socket',
    addTrailingSlash: false,
    cors: {
      origin: [
        'https://mothersauradiamonds.com',
        'https://www.mothersauradiamonds.com',
        'http://localhost:3000'
      ],
      methods: ['GET', 'POST'],
      credentials: true
    },
  });

  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    // Handle admin status change
    socket.on('admin_status_change', (status) => {
      console.log('Admin status changed to:', status);
      io.emit('admin_status', status);
    });

    // Handle new messages
    socket.on('message', (data) => {
      console.log('New message:', data);
      io.emit('message', data);
    });

    // Handle typing indicators
    socket.on('customer_typing', (data) => {
      socket.broadcast.emit('customer_typing', data);
    });

    socket.on('admin_typing', (data) => {
      socket.broadcast.emit('admin_typing', data);
    });

    // Handle new chat requests
    socket.on('new_chat_request', (request) => {
      socket.broadcast.emit('new_chat_request', request);
    });

    socket.on('disconnect', () => {
      console.log('Client disconnected:', socket.id);
    });
  });

  httpServer
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});














