import { Consumer, Kafka } from "kafkajs";

export class Player {
    private consumer: Consumer;
    private topic: string;
    private isPlaying: boolean = false;
    private ws: any;
    private events: any[] = [];

    constructor(kafka: Kafka, topic: string, groupid: string, ws: any) {
        this.topic = topic;
        this.consumer = kafka.consumer({ groupId: `${groupid}+${Math.random()}` });
        this.ws = ws;
    }

    async connect() {
        await this.consumer.connect();
        await this.consumer.subscribe({ topic: this.topic, fromBeginning: true });
    }

    async fetchAllEvents() {
        this.events = [];
        const consumer = this.consumer;

        // Start the consumer
        await consumer.run({
            eachMessage: async ({ message }) => {
                if (message.value) {
                    const event = JSON.parse(message.value.toString());
                    this.events.push(event);
                }
            }
        });

        await new Promise(res => setTimeout(res, 1000));
        await consumer.pause([{ topic: this.topic }]);
    }

    async play() {
        this.isPlaying = true;
        await this.fetchAllEvents();

        if (this.events.length === 0) return;

        this.events.sort((a, b) => a.timestamp - b.timestamp);

        const startTime = this.events[0].timestamp;

        this.events.forEach((event) => {
            const delay = event.timestamp - startTime;
            setTimeout(() => {
                if (this.isPlaying) {
                    this.ws.send(JSON.stringify({type:"stream",data:event}))
                }
            }, delay);
        });
    }

    pause() {
        this.isPlaying = false;
    }
}