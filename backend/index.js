// create a webscoket server with ws
import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 8080;

// Enable CORS for all routes
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type']
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});

// WebSocket Server
const wss = new WebSocketServer({ 
    server,
    clientTracking: true,
    perMessageDeflate: {
        zlibDeflateOptions: {
            chunkSize: 1024,
            memLevel: 7,
            level: 3
        },
        zlibInflateOptions: {
            chunkSize: 10 * 1024
        },
        clientNoContextTakeover: true,
        serverNoContextTakeover: true,
        threshold: 1024,
        concurrencyLimit: 10
    }
});

const allSockets = new Set();

wss.on('connection', (ws, req) => {
    console.log('New WebSocket connection');
    allSockets.add(ws);

    // Send welcome message
    ws.send(JSON.stringify({ type: 'connection', status: 'connected' }));

    ws.on('message', (message) => {
        try {
            const data = message.toString();
            console.log('Received:', data);
            
            // Broadcast to all connected clients
            allSockets.forEach((socket) => {
                if (socket.readyState === WebSocket.OPEN) {
                    socket.send(data);
                }
            });
        } catch (error) {
            console.error('Error handling message:', error);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
        allSockets.delete(ws);
    });

    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
        allSockets.delete(ws);
    });
});

// Handle server shutdown gracefully
process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully');
    wss.close();
    server.close(() => {
        console.log('Server closed');
        process.exit(0);
    });
});