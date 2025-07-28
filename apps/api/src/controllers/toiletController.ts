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

export const getToilet= async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        const toilet = await toiletService.getToiletById(_id);
        if (!toilet) {
            return res.status(404).json({message: "No toilet found"});
        }
        res.status(200).json(toilet);
    } catch (error) {
        res.status(500).json({message: "Error creating toilet"});
    }
};

export const updateToilet = async (req: Request, res: Response) => {
    try {
        const _id = req.params.id;
        const toiletUpdate: Partial<Toilet> = req.body;
        
        const updatedToilet = await toiletService.updateToiletById(_id, toiletUpdate);
        
        if (!updatedToilet) {
            return res.status(404).json({ message: "Toilet not found" });
        }
        
        res.status(200).json(updatedToilet);
    } catch (error) {
        res.status(500).json({ message: `Error updating toilet: ${error}` });
    }
};

export const createToilet = async (req: Request, res: Response) => {
    const toiletPayload: Toilet = req.body
    try {
        const newToilet = await toiletService.createNewToilet(toiletPayload);
        res.status(200).json(newToilet);
    } catch (error) {
        res.status(500).json({message: "Error creating toilet"});
    }
}

export const createToiletBatch = async (req: Request, res: Response) => {
    const toiletPayload: Toilet[] = req.body
    try {
        const newToilet = await toiletService.createNewToiletBatch(toiletPayload);
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

export const getNearbyToilets = async (req: Request, res: Response) => {
    try {
        const { swLong, swLat, neLong, neLat} = req.query
        const nearbyToilets = await toiletService.findNearbyToilets(Number(swLong), Number(swLat), Number(neLong), Number(neLat));
        
        if (nearbyToilets.length === 0) {
            return res.status(404).json({message: "No nearby toilets found"});
        }
        
        res.status(200).json(nearbyToilets);
    } catch (error) {
        res.status(500).json({message: "Error finding nearby toilets: "+ error});
    }
}
