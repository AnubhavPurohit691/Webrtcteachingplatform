import { createClient, RedisClientType } from "redis";
import { users } from ".";
import dotenv from "dotenv"
dotenv.config()
console.log(process.env.Redisprocess)

export const pub: RedisClientType = createClient({
  url: process.env.Redisprocess||"redis://localhost:6379",
});
export const sub: RedisClientType = pub.duplicate();

export async function connectRedis() {
  try {
    await pub.connect();
    await sub.connect();

    sub.pSubscribe("*", (data, channel) => {
      console.log(data);
      users
        .filter((user) => user.roomid.includes(channel.toString()))
        .forEach((user) => {
          user.ws.send(data);
        });
    });
  } catch (error) {
    console.error("Error connecting to Redis:", error);
  }
}
