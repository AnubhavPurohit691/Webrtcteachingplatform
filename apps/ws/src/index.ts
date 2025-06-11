import { WebSocket, WebSocketServer } from 'ws';
import { handlesocket } from './handlesocket';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws:WebSocket) {
    handlesocket(ws)
});