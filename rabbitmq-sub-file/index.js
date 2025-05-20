const amqp = require('amqplib');
const fs = require('fs-extra');
const moment = require('moment');
const path = require('path');

// RabbitMQ connection settings
const RABBITMQ_URL = `amqp://${process.env.RABBITMQ_HOST}:${process.env.RABBITMQ_PORT}`;
const EXCHANGE_NAME = 'log_exchange_robin';

// Directory for log files
const LOG_DIR = path.join(__dirname, 'logs');

// Ensure log directory exists
fs.ensureDirSync(LOG_DIR);

// Get the current log file path based on date
function getCurrentLogFilePath() {
    const date = moment().format('YYYY-MM-DD');
    return path.join(LOG_DIR, `mountain_events_${date}.log`);
}

// Format event data for logging
function formatLogEntry(event) {
    const timestamp = moment().format('YYYY-MM-DD HH:mm:ss');
    return `[${timestamp}] ${event.eventType}: Mountain "${event.name}" (Altitude: ${event.altitude}m, Railway: ${event.mountainRailway})`;
}

// Write event to log file
async function logEvent(event) {
    const logFilePath = getCurrentLogFilePath();
    const logEntry = formatLogEntry(event) + '\n';
    
    try {
        await fs.appendFile(logFilePath, logEntry);
        console.log(`Event logged to ${logFilePath}`);
    } catch (error) {
        console.error('Error writing to log file:', error);
    }
}

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

        console.log('File logger subscriber started. Waiting for messages...');

        // Start consuming messages
        channel.consume(queue, async (msg) => {
            if (msg !== null) {
                try {
                    const event = JSON.parse(msg.content.toString());
                    await logEvent(event);
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