import express from 'express';
import cors from 'cors';
import swaggerjsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'
import logger from './middlewares/logger';
import settings from './config';
import { swaggerOptions } from './config/swagger';
import toiletRoutes from './routes/toiletRoutes';
import { connectDB } from './config/database';



connectDB();
const app = express();
const PORT = settings.PORT 
const swaggerDocs = swaggerjsdoc(swaggerOptions)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs))
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
