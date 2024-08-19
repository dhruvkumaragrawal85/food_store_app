import { Component, OnInit } from '@angular/core';
import { Order } from '../../../../shared/models/order';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CartService } from '../../../services/cart.service';
import { UserService } from '../../../services/user.service';
import { ToastrService } from 'ngx-toastr';
import { OrderService } from '../../../services/order.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-checkout-page',
  templateUrl: './checkout-page.component.html',
  styleUrl: './checkout-page.component.css'
})
export class CheckoutPageComponent implements OnInit {


  order:Order=new Order();

  checkoutForm!:FormGroup;
  constructor(cartService: CartService,
              private formBuilder:FormBuilder,
              private userService:UserService,
              private toastrService: ToastrService,
              private orderService: OrderService,
              private router: Router
  ){
    const cart=cartService.getCart();//using get cart to get subject, to get latest value
    this.order.items=cart.items;
    this.order.totalPrice=cart.totalPrice;
  }

  ngOnInit(): void {
    let {name, address}=this.userService.currentUser;
    this.checkoutForm=this.formBuilder.group({
      name:[name, Validators.required],
      address:[address, Validators.required]
    });
  }

  get fc(){
    return this.checkoutForm.controls;
  }

  createOrder(){
    if(this.checkoutForm.invalid)
    {
      this.toastrService.warning('Please fill the inputs', 'Invalid INputs');
      return;
    }

    if(!this.order.addressLatLng){
      this.toastrService.warning('Please select your location on the map', 'Location');
      return;
    }

    this.order.name = this.fc.name.value;
    this.order.address = this.fc.address.value;

    this.orderService.create(this.order).subscribe({//call order service
      next:() => {
        this.router.navigateByUrl('/payment');//navigate to payment page
      },
      error:(errorResponse) => {
        this.toastrService.error(errorResponse.error, 'Cart');
      }
    })
  }

}
