import { WebSocket, WebSocketServer } from 'ws';
import { handlesocket } from './handlesocket';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws: WebSocket) {


    ws.on("message", (message) => {
        wss.clients.forEach((c) => {
            if(c!==ws){

                c.send(message.toString())
            }
        })
        // handlesocket(message.toString(),ws)
    })
});