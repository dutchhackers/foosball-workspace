import { CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException } from '@nestjs/common';
import { catchError, Observable } from 'rxjs';

@Injectable()
export class FirebaseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<UnauthorizedException> {
    return next.handle().pipe(
      catchError(error => {
        const msg = error.message;
        if (error.name === 'FirebaseError') {
          if (msg.includes('auth/')) {
            throw new UnauthorizedException('The combination of user name and password is incorrect');
          }
          throw new UnauthorizedException('Something went wrong');
        } else {
          throw error;
        }
      })
    );
  }
}
