import {model, Schema, Types} from 'mongoose';
import { Food, FoodSchema } from './food.model';
import { OrderStatus } from '../constants/order_status';


export interface LatLng{
    lat: string;
    lng: string;
}//leaflet only in frontend


//interface for code completion
//schema for mongooose to add models in db


export const LatLngSchema = new Schema<LatLng>(
    {
        lat: {type: String, required: true},
        lng: {type: String, required: true},
    }
);

export interface OrderItem{
    food: Food;
    price: number;
    quantity: number;
}

export const OrderItemSchema = new Schema<OrderItem>(
    {
        food:{type: FoodSchema, required: true},
        price:{ type: Number, required:true},
        quantity: {type: Number, required: true}
    }
);


export interface Order{
    //class taken from frontend model, changed to interface
    id:string;
    items: OrderItem[];
    totalPrice:number;
    name: string;
    address: string;
    addressLatLng:LatLng
    paymentId: string;
    status: OrderStatus;
    user: Types.ObjectId;//ts type
    createdAt: Date;
    updatedAt: Date;
  }


  const orderSchema = new Schema<Order>({
    name: {type: String, required: true},
    address: {type: String, required: true},
    addressLatLng: {type: LatLngSchema, required: true},
    paymentId: {type: String},
    totalPrice: {type: Number, required: true},
    items: {type: [OrderItemSchema], required: true},
    status: {type: String, default: OrderStatus.NEW},
    user: {type: Schema.Types.ObjectId, required: true}//schema type
},{
    timestamps: true,//timestamps 
    toJSON:{
        virtuals: true
        //ensures that virtual properties (which are not stored
        //in MongoDB but are computed on the fly) are included in the output 
    },
    toObject:{
        virtuals: true
    }
});

export const OrderModel = model('order', orderSchema);