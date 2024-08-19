import {Router} from 'express';
import asyncHander from 'express-async-handler';
import { HTTP_BAD_REQUEST } from '../constants/http_status';
import { OrderStatus } from '../constants/order_status';
import { OrderModel } from '../models/order.model';
import auth from '../middlewares/auth.mid';

const router = Router();
router.use(auth);

router.post('/create',//api
asyncHander(async (req:any, res:any) => {
    const requestOrder = req.body;

    if(requestOrder.items.length <= 0){
        res.status(HTTP_BAD_REQUEST).send('Cart Is Empty!');
        return;
    }

    await OrderModel.deleteOne({
        user: req.user.id,
        status: OrderStatus.NEW
    });

    const newOrder = new OrderModel({...requestOrder,user: req.user.id});//creating new order//spread
    await newOrder.save();
    res.send(newOrder);//send to client
})
)

router.get('/newOrderForCurrentUser', asyncHander( async (req:any,res ) => {
    const order= await OrderModel.findOne({user: req.user.id, status: OrderStatus.NEW});
    if(order) res.send(order);
    else res.status(HTTP_BAD_REQUEST).send();
}))

export default router;