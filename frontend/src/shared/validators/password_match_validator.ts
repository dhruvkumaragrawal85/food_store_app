import { AbstractControl } from "@angular/forms"

export const PasswordsMatchValidator = (passwordControlName: string,
    confirmPasswordControlName: string) => {
      const validator = (form: AbstractControl) => {//validator is another function
        const passwordControl =  form.get(passwordControlName);//find a control in this form
        const confirmPasswordControl =  form.get(confirmPasswordControlName);//for confirm password

        if(!passwordControl || !confirmPasswordControl) return;//if undef just return false

        if(passwordControl.value !== confirmPasswordControl.value){
          confirmPasswordControl.setErrors({notMatch: true});
        }else{
          const errors = confirmPasswordControl.errors;
          if(!errors) return;

          delete errors.notMatch;
          confirmPasswordControl.setErrors(errors);
        }
      }
      return validator;//return the whole function
    }