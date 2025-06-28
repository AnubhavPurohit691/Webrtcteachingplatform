import { prismaClient } from "@repo/db/db";
import { createClient, RedisClientType } from "redis";
import { users } from ".";
import { Player } from "./Player";

export const pub: RedisClientType = createClient({
    url: "redis://localhost:6379",
});
export const sub: RedisClientType = pub.duplicate()


export async function connectRedis() {
    try {
        await pub.connect();
        await sub.connect()

        sub.pSubscribe("*",(data,channel)=>{
          console.log(data)
          users.filter((user)=>user.roomid.includes(channel.toString()))
          .forEach((user)=>{
            user.ws.send(data)
          })
        })
    } catch (error) {
        console.error("Error connecting to Redis:", error);
    }
}

