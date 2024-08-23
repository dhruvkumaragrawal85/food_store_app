import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Order } from '../../shared/models/order';
import { ORDER_CREATE_URL, ORDER_NEW_FOR_CURRENT_USER_URL, ORDER_PAY_URL, ORDER_TRACK_URL } from '../../shared/constants/urls';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class OrderService {


  constructor(private http: HttpClient) { }

  create(order:Order){
    return this.http.post<Order>(ORDER_CREATE_URL, order);
  }

  getNewOrderForCurrentUser():Observable<Order>{//fetches the most recent order for the logged-in user by making a GET req
    return this.http.get<Order>(ORDER_NEW_FOR_CURRENT_USER_URL);
  }
  pay(order:Order):Observable<string>{//returns a string, probably indicating the result of the payment
    return this.http.post<string>(ORDER_PAY_URL,order);
    //sends payment information for an order to the server
  }
  trackOrderById(id:number): Observable<Order>{
    return this.http.get<Order>(ORDER_TRACK_URL + id);//used trailing slash in track url
  }
}