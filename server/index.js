import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import path from "path";
import connectDB from './mongodb/connect.js';
import postRoutes from './routes/postRoutes.js';
import dalleRoutes from './routes/dalleRoutes.js';

dotenv.config();

const app = express();
const _dirname = path.resolve();

app.use(cors());
app.use(express.json({ limit: '50mb' }));

app.use('/api/v1/post', postRoutes);
app.use('/api/v1/dalle', dalleRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ message: 'Hello from Pixel.ai!' });
});

const distPath = path.join(_dirname, 'client', 'dist');
app.use(express.static(distPath));

app.get(/^\/(?!api\/).*/, (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

const startServer = async () => {
  try {
    connectDB(process.env.MONGODB_URL);
    app.listen(8080, () => console.log('Server started on port 8080'));
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
