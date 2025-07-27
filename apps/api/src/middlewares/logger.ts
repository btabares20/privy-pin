import { Request, Response, NextFunction } from "express";

const logger = (req: Request, res: Response, next: NextFunction) => {
    const method = req.method;
    const url = req.url;
    res.on('finish', () => {
        console.log(`${method} ${url} ${res.statusCode}`);
    });

    next();
}

export default logger;
