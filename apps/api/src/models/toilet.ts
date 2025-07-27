import mongoose, {Schema, Document} from 'mongoose';
import { Toilet } from '@repo/shared/src/toilet';

export interface IToilet extends Toilet, Document {};

export const toiletSchema = new Schema<IToilet>({
    name: { type: String, required: true},
    location: { 
        type: {
            type: String,
            required: true,
            enum: ['Point', 'Polygon']
        },
        coordinates: {
            type: [Number],
            required: true,
            validate: {
                validator: function(coordinates: number[]) {
                    return coordinates.length === 2;
                },
                message: 'Coordinates must be an array of exactly 2 numbers [longitude, latitude]'
            }
        }
    }
}, {
    timestamps: true
});

export const ToiletModel = mongoose.model<IToilet>('Toilet', toiletSchema); 
