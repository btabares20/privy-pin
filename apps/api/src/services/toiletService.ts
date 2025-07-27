import { ToiletModel } from "../models/toilet";

export const getAllToilets = async () => {
    return await ToiletModel.find();
}
