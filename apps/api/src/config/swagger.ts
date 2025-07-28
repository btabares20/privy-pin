export const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Privy Pin API',
            description: '',
            contact: {
                name: 'Bryan Tabares'
            },
            version: "0.1.0"
        },
        servers: [
            {
                url: "http://localhost:3001/api"
            }
        ],
    },
    apis: ['./src/routes/*.ts']
}
