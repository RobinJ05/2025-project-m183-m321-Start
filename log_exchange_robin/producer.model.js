const amqp = require('amqplib');

class ProducerModel {
    constructor() {
        this.connection = null;
        this.channel = null;
        this.exchangeName = 'log_exchange_robin';
    }

    async connect() {
        try {
            this.connection = await amqp.connect('amqp://localhost');
            this.channel = await this.connection.createChannel();
            await this.channel.assertExchange(this.exchangeName, 'fanout', {
                durable: false
            });
        } catch (error) {
            console.error('Error connecting to RabbitMQ:', error);
            throw error;
        }
    }

    async publish(routingKey, message) {
        try {
            if (!this.channel) {
                await this.connect();
            }
            await this.channel.publish(
                this.exchangeName,
                routingKey,
                Buffer.from(JSON.stringify(message))
            );
            console.log(`Message published to exchange ${this.exchangeName}`);
        } catch (error) {
            console.error('Error publishing message:', error);
            throw error;
        }
    }

    async closeConnection() {
        try {
            if (this.channel) {
                await this.channel.close();
            }
            if (this.connection) {
                await this.connection.close();
            }
        } catch (error) {
            console.error('Error closing connections:', error);
            throw error;
        }
    }
}

module.exports = new ProducerModel();