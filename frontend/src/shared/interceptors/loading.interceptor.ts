import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpEventType
} from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoadingService } from '../../app/services/loading.service';
var pendingRequests = 0;//to handle multiple requests
@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  constructor(private loadingService: LoadingService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    //intercept method called for every http operation, 
    this.loadingService.showLoading();

    pendingRequests = pendingRequests + 1;

    return next.handle(request).pipe(
      tap({//tap to perform side operations with disturbing main stream
        next:(event) => {
            //happy part
          if(event.type === HttpEventType.Response){
            this.handleHideLoading();
          }
        },
        error: (_) => {
          this.handleHideLoading();
        }
      })
    );
  }

  handleHideLoading(){
    pendingRequests = pendingRequests - 1;
    if (pendingRequests === 0) {
        // Introduce a delay before hiding the loading indicator
        setTimeout(() => {
          this.loadingService.hideLoading();
        }, 300); // Adjust the delay time as needed (500ms in this case)
      }
  }
}