import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { Order } from '../../../../shared/models/order';
import { OrderService } from '../../../services/order.service';
import { CartService } from '../../../services/cart.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

declare var paypal:any;//same as window.paypal, is TS to use paypal sdk
@Component({
  selector: 'paypal-button',
  templateUrl: './paypal-button.component.html',
  styleUrl: './paypal-button.component.css'
})
export class PaypalButtonComponent implements OnInit{
  @Input()
  order!:Order;
  @ViewChild('paypal', {static: true})
  paypalElement!:ElementRef;
  //ElementRef is a service in Angular that provides a way to directly access the DOM 

  constructor(private orderService: OrderService,
              private cartService: CartService,
              private router:Router,
              private toastrService: ToastrService) { }

  ngOnInit(): void {
    const self = this;
    paypal
    .Buttons({
      createOrder: (data: any, actions: any) => {
        return actions.order.create({
          purchase_units: [
            {
              amount: {
                currency_code: 'USD',
                value: self.order.totalPrice,
              },
            },
          ],
        });
      },

      onApprove: async (data: any, actions: any) => {
        const payment = await actions.order.capture();
        this.order.paymentId = payment.id;
        self.orderService.pay(this.order).subscribe(//send order to server, get order id
          {
            next: (orderId) => {
              this.cartService.clearCart();//clear cart
              this.router.navigateByUrl('/track/' + orderId);//redirect to new page
              this.toastrService.success(
                'Payment Saved Successfully',
                'Success'
              );
            },
            error: (error) => {
              this.toastrService.error('Payment Save Failed', 'Error');
            }
          }
        );
      },

      onError: (err: any) => {
        this.toastrService.error('Payment Failed', 'Error');
        console.log(err);
      },
    })
    .render(this.paypalElement.nativeElement);//to decide where to put the html tag for the button, like map need viewchild tag
    //method is called to actually insert the button into the DOM.
  }
}
