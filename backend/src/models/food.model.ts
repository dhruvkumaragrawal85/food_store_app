import {Schema, model} from 'mongoose';

// Define the TypeScript interface for the Food object
export interface Food {
    id: string;
    name: string;
    price: number;
    tags: string[];
    favorite: boolean;
    stars: number;
    imageUrl: string;
    origins: string[];
    cookTime: string;
}

// Create a Mongoose schema based on the Food interface
export const FoodSchema = new Schema<Food>(
    {
        name: {type: String, required:true},
        price: {type: Number, required:true},
        tags: {type: [String]},
        favorite: {type: Boolean, default:false},
        stars: {type: Number, required:true},
        imageUrl: {type: String, required:true},
        origins: {type: [String], required:true},
        cookTime: {type: String, required:true}
    },{
          // Include virtual properties when converting to JSON
          toJSON: {
            virtuals: true
        },
        // Include virtual properties when converting to a plain JavaScript object
        toObject: {
            virtuals: true
        },
        // Automatically add `createdAt` and `updatedAt` timestamps to the schema
        timestamps: true
    }
);

// Create a Mongoose model based on the Food schema
export const FoodModel = model<Food>('food', FoodSchema);