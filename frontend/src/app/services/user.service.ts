import { Injectable } from '@angular/core';
import { IUserLogin } from '../../shared/interfaces/IUserLogin';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { User } from '../../shared/models/User';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { USER_CHANGE_PASSWORD_URL, USER_LOGIN_URL, USER_REGISTER_URL, USER_UPDATE_PROFILE_URL } from '../../shared/constants/urls';
import { IUserRegister } from '../../shared/interfaces/IUserRegister';
import { IUserUpdateProfile } from '../../shared/interfaces/IUserUpdateProfile';

const USER_KEY = 'User';
@Injectable({
  providedIn: 'root'
})
export class UserService {
  private userSubject =
  new BehaviorSubject<User>(this.getUserFromLocalStorage());
  public userObservable:Observable<User>;
  constructor(private http:HttpClient, private toastrService:ToastrService) {
    this.userObservable = this.userSubject.asObservable();
  }


  public get currentUser():User{
    return this.userSubject.value;
  }

  
  login(userLogin:IUserLogin):Observable<User>{
    return this.http.post<User>(USER_LOGIN_URL, userLogin).pipe(//Used to stitch together functional operators into a chain.
      tap({
        next: (user) =>{
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Welcome to Foodmine ${user.name}!`,
            'Login Successful'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Login Failed');
        }
      })
    );
  }



  register(userRegiser:IUserRegister): Observable<User>{
    return this.http.post<User>(USER_REGISTER_URL, userRegiser).pipe(
      tap({
        //'tap' allows side effects for notifications from the observable 
        //without modifying the emitted values
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);//to keep logged in
          this.toastrService.success(
            `Welcome to the Foodmine ${user.name}`,
            'Register Successful'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error,
            'Register Failed')
        }
      })
    )
  }
  logout(){
    this.userSubject.next(new User());
    localStorage.removeItem(USER_KEY);
    window.location.reload();
  }
  updateProfile(userUpdateProfile: IUserUpdateProfile): Observable<User> {
    return this.http.put<User>(USER_UPDATE_PROFILE_URL, userUpdateProfile).pipe(
      tap({
        next: (user) => {
          this.setUserToLocalStorage(user);
          this.userSubject.next(user);
          this.toastrService.success(
            `Profile Updated Successfully`,
            'Profile Updated'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Profile Update Failed')
        }
      })
    )
  }

  changePassword(currentPassword: string, newPassword: string) {

    // Construct the request body
    const requestBody = {
      currentPassword: currentPassword,
      newPassword: newPassword,
    };

    return this.http.put(USER_CHANGE_PASSWORD_URL, requestBody).pipe(
      tap({
        next: () => {
          this.toastrService.success(
            `Password Changed Successfully`,
            'Password Changed'
          )
        },
        error: (errorResponse) => {
          this.toastrService.error(errorResponse.error, 'Password Change Failed')
        }
      })
    );
  }
  private setUserToLocalStorage(user:User){
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }

  private getUserFromLocalStorage():User{
    const userJson = localStorage.getItem(USER_KEY);
    if(userJson) return JSON.parse(userJson) as User;
    return new User();
  }
}