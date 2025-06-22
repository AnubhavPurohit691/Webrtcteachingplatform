import {prismaClient} from "@repo/db/db"
import { CustomWebSocket, users } from ".";
export async function handlesocket(message: string, ws: CustomWebSocket) {
  const data = JSON.parse(message);

  switch (data.type) {
    case "join":
      const adminuser = await prismaClient.room.findFirst({
        where:{
          id:data.roomid
        },
        select:{
          userId: true,
        }
      })
        const existingUser = users.find((user) => user.userid === ws.userid);
        if (existingUser) {
          if (!existingUser.roomid.includes(data.roomid)) {
            existingUser.roomid.push(data.roomid);
            console.log(`User ${ws.userid} joined room ${data.roomid}`);
          }
          ws.send(JSON.stringify({
              type: "joined",
              admin:adminuser?.userId === ws.userid
            }));
        } else {
            if(ws.userid === undefined)return ws.close(); ;
            users.push({ userid: ws.userid, roomid: [data.roomid], ws ,isAdmin:adminuser?.userId === ws.userid});
            ws.send(JSON.stringify({
              type: "joined",
              admin:adminuser?.userId === ws.userid
            }));
            console.log(`User ${ws.userid} joined room ${data.roomid}`);
        }
      break;
      case "modification": {
        // Only allow admin to broadcast modification
        if(data.recording){
          
        }
        const sender = users.find(user => user.userid === ws.userid);
        if (sender && sender.isAdmin) {
          users
            .filter(user => user.roomid.includes(data.roomid.toString()))
            .forEach(user => {
              user.ws.send(JSON.stringify(data));
            });
        }
        break;
      }
      case "rectangle":
      case "drawing":
      case "text":
      case "circle":
      case "arrow":
        users
          .filter(user => user.roomid.includes(data.roomid.toString()))
          .forEach(user => {
            user.ws.send(JSON.stringify(data));
            console.log(`Sent rectangle data to user ${user.userid} in room ${data.roomid}`);
          });
        break;
    default:
      break;
  }
}
