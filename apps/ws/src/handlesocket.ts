import { prismaClient } from "@repo/db/db";
import { CustomWebSocket, users } from ".";
import { Kafka } from "kafkajs";
import { Player } from "./Player";
import {  pub} from "./connectredis";

const kafka = new Kafka({
  clientId: "TeachingApp",
  brokers: ["localhost:9092"],
});

const producer = kafka.producer();

function setup() {
  // Kafka connection
  producer.connect().then(() => {
    console.log("✅ Kafka connected");
  });
}



// Call setup once when the module is loaded
setup();

export async function handlesocket(message: string, ws: CustomWebSocket) {
  const data = JSON.parse(message);

  if (data.recording === true) {
    if (!ws.userid) return ws.close();

    await producer.send({
      topic: data.roomid.toString(),
      messages: [
        {
          value: JSON.stringify({
            type: data.type,
            roomid: data.roomid,
            data: data,
            timestamp: data.timestamp,
          }),
        },
      ],
    });
  }

  switch (data.type) {
    case "join": {
      const adminuser = await prismaClient.room.findFirst({
        where: { id: data.roomid },
        select: { userId: true },
      });

      const existingUser = users.find((user) => user.userid === ws.userid);

      if (existingUser) {
        if (!existingUser.roomid.includes(data.roomid)) {
          existingUser.roomid.push(data.roomid);
          console.log(`User ${ws.userid} joined room ${data.roomid}`);
        }

        ws.send(
          JSON.stringify({
            type: "joined",
            admin: adminuser?.userId === ws.userid,
          })
        );
      } else {
        if (!ws.userid) return ws.close();

        users.push({
          userid: ws.userid,
          roomid: [data.roomid],
          ws,
          isAdmin: adminuser?.userId === ws.userid,
        });

        ws.send(
          JSON.stringify({
            type: "joined",
            admin: adminuser?.userId === ws.userid,
          })
        );

        console.log(`User ${ws.userid} joined room ${data.roomid}`);
      }

      break;
    }

    case "modification":
    case "rectangle":
    case "drawing":
    case "text":
    case "circle":
    case "arrow": {
      const sender = users.find((user) => user.userid === ws.userid);
      if (sender && sender.isAdmin) {
        console.log(data)
        await pub.publish(data.roomid.toString(), JSON.stringify(data)); 
      }
      break;
    }

    case "streaming": {
      const playerid = ws.userid;
      if (!playerid) return ws.close();

      if (!ws.player) {
        ws.player = new Player(kafka, data.roomid.toString(), playerid, ws);
        await ws.player.connect();
        console.log("Player connected");
      }

      if (data.action === "play") {
        ws.player.play();
      } else if (data.action === "pause") {
        ws.player.pause();
      }

      // await pub.publish(data.roomid, JSON.stringify(data));
      break;
    }

    default:
      break;
  }
}
