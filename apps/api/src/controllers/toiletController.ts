import { Request, Response } from "express";
import * as toiletService from '../services/toiletService';


export const getToilets = async (req: Request, res: Response) => {
    const toilets = await toiletService.getAllToilets();
    if (toilets.length === 0) {
        return res.status(404).json({message: "No toilets found"});
    }
    res.status(200).json(toilets);
};

