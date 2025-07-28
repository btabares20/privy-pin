import { ToiletModel } from "../models/toilet";
import { Toilet, ToiletLocation, ToiletsNearby } from "@repo/shared/src/toilet";

export const getAllToilets = async () => {
    return await ToiletModel.find();
};

export const getToiletById= async (_id: String) => {
    return await ToiletModel.findById(_id);
};

export const createNewToilet = async (toilet: Toilet) => {
    return await ToiletModel.create(toilet);
};

export const createNewToiletBatch = async (toilet: Toilet[]) => {
    return await ToiletModel.insertMany(toilet);
};

export const updateToiletById = async (_id: String, toiletUpdate: Partial<Toilet>) => {
    return await ToiletModel.updateOne({_id: _id}, toiletUpdate, { new: true});
}

export const deleteToiletById = async (_id: String) => {
    return await ToiletModel.findByIdAndDelete(_id);
};

export const createToiletsNearby = ($geometry: ToiletLocation, $maxDistance: number): ToiletsNearby => {
    return {
        location: {
            $near: { $geometry, $maxDistance },
        }
    }
}
export const findNearbyToilets = async (coordinates: [number, number], maxDistance: number) => {
    const locationToSearch: ToiletsNearby = createToiletsNearby({
        type: "Point",
        coordinates: coordinates
    }, maxDistance);
    return await ToiletModel.find(locationToSearch);
};
