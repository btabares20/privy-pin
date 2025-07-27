import express from 'express';
import cors from 'cors';
import logger from './middlewares/logger';

const app = express();
const PORT = process.env.PORT || 3001;


app.use(cors());
app.use(express.json());
app.use(logger);

app.get('/api/health', (req, res) => {
    res.status(200).json({ message: 'Privy Pin API is running! Yey, you can fuck off now!'});
});

app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
});
