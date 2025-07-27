import { Request, Response } from "express";
import * as toiletService from '../services/toiletService';
import { Toilet } from "@repo/shared/src/toilet";


export const getToilets = async (req: Request, res: Response) => {
    try {
        const toilets = await toiletService.getAllToilets();
        if (toilets.length === 0) {
            return res.status(404).json({message: "No toilets found"});
        }
        res.status(200).json(toilets);
    } catch (error) {
        res.status(500).json({message: "Error creating toilet"});
    }
};

export const createToilet = async (req: Request, res: Response) => {
    const toiletRequest: Toilet = req.body
    try {
        const newToilet = await toiletService.createNewToilet(toiletRequest);
        res.status(200).json(newToilet);
    } catch (error) {
        res.status(500).json({message: "Error creating toilet"});
    }
}

export const deleteToilet = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        const deletedToilet = await toiletService.deleteToiletById(_id);

        if (!deletedToilet) {
            return res.status(404).json({ message: "Toilet not found" });
        } 
        res.status(204).end();
    } catch (error) {
        res.status(500).json({message: "Error deleting toilet"});
    }
}
