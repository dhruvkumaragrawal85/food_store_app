import { Food } from "./Foods";

export class CartItem {
  quantity: number;
  price: number;

  constructor(public food: Food) {
    this.food = food;
    this.quantity = 1;
    this.price = food.price;
  }
}
