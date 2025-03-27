const express = require('express');
const producerModel = require('./producer.model');

const app = express();
app.use(express.json());

// Add event endpoint
app.post('/api/logevent/add', async (req, res) => {
    try {
        const logData = req.body;
        await producerModel.publish('', logData);
        res.status(200).json({ message: 'Event logged successfully' });
    } catch (error) {
        console.error('Error handling add event:', error);
        res.status(500).json({ error: 'Failed to log event' });
    }
});

// Edit event endpoint
app.post('/api/logevent/edit', async (req, res) => {
    try {
        const logData = req.body;
        await producerModel.publish('', logData);
        res.status(200).json({ message: 'Event logged successfully' });
    } catch (error) {
        console.error('Error handling edit event:', error);
        res.status(500).json({ error: 'Failed to log event' });
    }
});

// Delete event endpoint
app.post('/api/logevent/delete', async (req, res) => {
    try {
        const logData = req.body;
        await producerModel.publish('', logData);
        res.status(200).json({ message: 'Event logged successfully' });
    } catch (error) {
        console.error('Error handling delete event:', error);
        res.status(500).json({ error: 'Failed to log event' });
    }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Exchange server is running on port ${PORT}`);
});