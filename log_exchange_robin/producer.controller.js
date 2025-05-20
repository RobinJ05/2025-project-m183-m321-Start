import promclient from "prom-client";
import express from 'express';
import logEventRouter from './producer.routes.js';

const app = express();
app.use(express.json());

const register = promclient.register;

// collect default metrics like memory usage, CPU, etc.
promclient.collectDefaultMetrics();

// Custom metric example
const httpRequestCounter = new promclient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'path', 'status'],
});

app.use((req, res, next) => {
  res.on('finish', () => {
    httpRequestCounter.labels(req.method, req.path, res.statusCode).inc();
  });
  next();
});


// Use the router for log event endpoints
app.use('/api/logevent', logEventRouter);

app.get('/metrics', async (req, res) => {
  try {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  } catch (ex) {
    res.status(500).end(ex);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Exchange server is running on port ${PORT}`);
});