const express = require('express');
const logEventRouter = require('./producer.routes');

const app = express();
app.use(express.json());

// Use the router for log event endpoints
app.use('/api/logevent', logEventRouter);

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Exchange server is running on port ${PORT}`);
});