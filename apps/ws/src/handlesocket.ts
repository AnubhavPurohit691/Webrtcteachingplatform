import { WebSocket } from "ws";

interface User{
    ws:WebSocket,
    roomId:string, 
    userId:string
}
const user:User[]=[]


export function handlesocket(message:string,ws:WebSocket){
const data = JSON.parse(message) 

 
}