import { ToiletModel } from "../models/toilet";
import { Toilet } from "@repo/shared/src/toilet";

export const getAllToilets = async () => {
    return await ToiletModel.find();
};

export const getToiletById= async (_id: String) => {
    return await ToiletModel.findById(_id);
};

export const createNewToilet = async (toilet: Toilet) => {
    return await ToiletModel.create(toilet);
};

export const updateToiletById = async (_id: String, toiletUpdate: Partial<Toilet>) => {
    return await ToiletModel.updateOne({_id: _id}, toiletUpdate, { new: true});
}

export const deleteToiletById = async (_id: String) => {
    return await ToiletModel.findByIdAndDelete(_id);
};
