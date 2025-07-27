import express from 'express';
import cors from 'cors';
import logger from './middlewares/logger';
import settings from './config';
import toiletRoutes from './routes/toiletRoutes';
import { connectDB } from './config/database';


connectDB();
const app = express();
const PORT = settings.PORT 

app.use(cors());
app.use(express.json());
app.use(logger);

app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Privy Pin API is running! Yey, you can fuck off now!'});
});

app.use('/api/toilets', toiletRoutes);

app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
});
