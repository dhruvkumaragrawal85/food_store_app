import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user.service';


// In Angular, a "guard" is like a security checkpoint that controls access to certain parts
// of an application, like a webpage or route. 
// Think of it as a bouncer at a club who decides who gets in and who doesn't.

// AuthGuard is a specific type of guard that checks if a user is logged in (authenticated) 
// before allowing them to access certain routes. If the user isn't logged in, the AuthGuard can 
// redirect them to a login page instead of letting them through.

export const authGuard: CanActivateFn = (route, state) => {

  const router = inject(Router);
  const userService = inject(UserService);

  if (userService.currentUser.token) {
    return true;
  }

  router.navigate(['/login'], { queryParams: { returnUrl: state.url } })
  return false;
};

