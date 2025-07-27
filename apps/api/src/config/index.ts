import config from 'dotenv';

config.config();

const settings= {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: parseInt(process.env.PORT || '3001', 10),
    MONGO_ROOT_USERNAME: process.env.MONGO_ROOT_USERNAME!,
    MONGO_ROOT_PASSWORD: process.env.MONGO_ROOT_PASSWORD!,
    MONGO_DATABASE: process.env.MONGO_DATABASE!,
    MONGODB_URI: process.env.MONGODB_URI!,
    MONGODB_URI_DOCKER: process.env.MONGODB_URI_DOCKER!
}

export default settings;
