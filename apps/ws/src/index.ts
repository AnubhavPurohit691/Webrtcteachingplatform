import { WebSocket, WebSocketServer } from "ws";
import { handlesocket } from "./handlesocket";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Player } from "./Player";
import { connectRedis } from "./connectredis";
dotenv.config();

interface user {
  userid: string;
  roomid: string[];
  ws: WebSocket;
  isAdmin?: boolean;
}
export const users: user[] = [];

const wss = new WebSocketServer({ port: 8080 });
export interface CustomWebSocket extends WebSocket {
  userid?: string;
  player: Player; // Optional user ID property
}
function checktoken(token: string): string | null {
  const user = jwt.verify(token, process.env.Secret as string) as {
    id: string;
  } | null;
  return user?.id || null;
}

connectRedis().catch((err)=>{
  console.log(err)
})
wss.on("connection", async function connection(ws: CustomWebSocket, req) {
  const url = req.url;
  if (!url) {
    return;
  }
  const queryparams = new URLSearchParams(url.split("?")[1]);
  const token = queryparams.get("token");
  if (!token) {
    ws.close();
    return;
  }
  const userid = checktoken(token);
  if (!userid) {
    ws.close();
    return;
  }
  ws.userid = userid;
  ws.on("message", (data) => {
    handlesocket(data.toString(), ws);
  });
});
