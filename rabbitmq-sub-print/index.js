const amqp = require('amqplib');

// RabbitMQ connection settings
const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
const EXCHANGE_NAME = 'log_exchange_robin';

// Circular buffer to store the last 15 events
class EventBuffer {
    constructor(capacity) {
        this.capacity = capacity;
        this.buffer = [];
    }

    add(event) {
        if (this.buffer.length >= this.capacity) {
            this.buffer.shift(); // Remove oldest event
        }
        this.buffer.push(event);
        this.display();
    }

    display() {
        console.clear(); // Clear the console
        console.log('=== Last 15 Mountain Events ===');
        console.log('------------------------------');
        
        this.buffer.slice().reverse().forEach((event, index) => {
            console.log(`${index + 1}. ${event.eventType}: Mountain "${event.name}"`);
            console.log(`   Altitude: ${event.altitude}m`);
            console.log(`   Railway: ${event.mountainRailway}`);
            console.log('------------------------------');
        });
    }
}

// Create event buffer with capacity of 15
const eventBuffer = new EventBuffer(2);

// Connect to RabbitMQ and start consuming messages
async function startSubscriber() {
    try {
        // Connect to RabbitMQ
        const connection = await amqp.connect(RABBITMQ_URL);
        const channel = await connection.createChannel();

        // Ensure exchange exists
        await channel.assertExchange(EXCHANGE_NAME, 'fanout', { durable: false });

        // Create a queue and bind it to the exchange
        const { queue } = await channel.assertQueue('', { exclusive: true });
        await channel.bindQueue(queue, EXCHANGE_NAME, '');

        console.log('Console display subscriber started. Waiting for messages...');

        // Start consuming messages
        channel.consume(queue, (msg) => {
            if (msg !== null) {
                try {
                    const event = JSON.parse(msg.content.toString());
                    eventBuffer.add(event);
                    channel.ack(msg);
                } catch (error) {
                    console.error('Error processing message:', error);
                    channel.nack(msg);
                }
            }
        });

        // Handle connection closure
        process.on('SIGINT', async () => {
            await channel.close();
            await connection.close();
            process.exit(0);
        });
    } catch (error) {
        console.error('Error connecting to RabbitMQ:', error);
        process.exit(1);
    }
}

// Start the subscriber
startSubscriber();