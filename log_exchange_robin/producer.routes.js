const express = require('express');
const router = express.Router();
const producerModel = require('./producer.model');

// Add event endpoint
router.post('/add', async (req, res) => {
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
router.post('/edit', async (req, res) => {
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
router.post('/delete', async (req, res) => {
    try {
        const logData = req.body;
        await producerModel.publish('', logData);
        res.status(200).json({ message: 'Event logged successfully' });
    } catch (error) {
        console.error('Error handling delete event:', error);
        res.status(500).json({ error: 'Failed to log event' });
    }
});

module.exports = router;