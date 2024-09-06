import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class SlackAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest();
    return validateRequest(request);
  }
}

function validateRequest(request: any) {
  const payload = request.body;
  const { user_id, user_name } = payload;

  // Logic for now: fail if the user id/name is missing
  if (!user_id || !user_name) {
    return false;
  }
  return true;
}
