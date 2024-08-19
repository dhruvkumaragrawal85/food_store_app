import {Schema, model} from 'mongoose';


// Define the TypeScript interface for the user object
export interface User{
    id:string;
    email:string;
    password: string;
    name:string;
    address:string;
    isAdmin:boolean;
}


// Create a Mongoose schema based on the User interface
export const UserSchema = new Schema<User>({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    address: {type: String, required: true},
    isAdmin: {type: Boolean, required: true},
}, {
    //createdat, updatedat fields
    timestamps: true,
    toJSON:{
        virtuals: true
    },
    toObject:{
        virtuals: true
    }
});

// Create a Mongoose model based on the User schema
export const UserModel = model<User>('user', UserSchema);