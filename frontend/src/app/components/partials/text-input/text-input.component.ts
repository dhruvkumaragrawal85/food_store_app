import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
  selector: 'text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.css']
})
export class TextInputComponent implements OnInit {

  // @Input in Angular is a decorator used to define a property in a 
  // child component that allows data to be passed to it from a parent component.
  @Input()
  control!:AbstractControl;//for input and input validation
  @Input()
  showErrorsWhen:boolean = true;
  @Input()
  label!: string;
  @Input()
  type: 'text' | 'password' | 'email' = 'text';//to define type, text by default

  get formControl(){
    return this.control as FormControl;
  }// to cast as Formcontrol
    constructor() { }

    ngOnInit(): void {
    }

}