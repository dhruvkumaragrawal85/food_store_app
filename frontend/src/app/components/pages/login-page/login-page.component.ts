import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms'
import { UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent implements OnInit {

  loginForm!:FormGroup;

  isSubmitted=false;
  //if the form has been submitted
  //returnUrl is a property used to store the URL the user tried to access before being redirected to the login page.
  //This typically happens when a user attempts to access a protected route without being logged in.
  //In the ngOnInit lifecycle hook, the component captures the returnUrl from the query parameters of the current route using activatedRoute.snapshot.queryParams.returnUrl.




  returnUrl = '';
  // Constructor with dependency injection for UserService, ActivatedRoute, and Router
  constructor(private formBuilder: FormBuilder
    , private userService:UserService,
     private activatedRoute:ActivatedRoute,
     private router:Router) { }
  
  ngOnInit(): void {
    this.loginForm=this.formBuilder.group({
      email:['', [Validators.required, Validators.email]],
      password:['', Validators.required]
    });

    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl;
  }
  // activatedRoute is a service that helps retrieve information about the current route, including query parameters.
  
  // converts loginForm.controls to shorter
  get fc(){
    return this.loginForm.controls;
  }

  submit(){
    this.isSubmitted=true;
    if(this.loginForm.invalid)return;
    this.userService.login({email:this.fc.email.value,
      password: this.fc.password.value}).subscribe(() => {
        this.router.navigateByUrl(this.returnUrl);
      });
  }

}
