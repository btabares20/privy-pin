import { ToiletModel } from "../models/toilet";
import { Toilet } from "@repo/shared/src/toilet";

export const getAllToilets = async () => {
    return await ToiletModel.find();
};

export const createNewToilet = async (toilet: Toilet) => {
    return await ToiletModel.create(toilet);
};

export const deleteToiletById = async (_id: String) => {
    return await ToiletModel.findByIdAndDelete(_id);
};
