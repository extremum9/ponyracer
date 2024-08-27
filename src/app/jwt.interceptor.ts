import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserService } from './user.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const userService = inject(UserService);
  const user = userService.currentUser();

  if (user) {
    const clone = req.clone({ setHeaders: { Authorization: `Bearer ${user.token}` } });
    return next(clone);
  }

  return next(req);
};
