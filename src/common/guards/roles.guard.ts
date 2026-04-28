import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {

    // skip public routes
    const isPublic = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPublic) {
      return true;
    }

    //  get roles metadata
    const roles = this.reflector.getAllAndOverride<string[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // route doesn't require roles
    if (!roles) return true;

    const { user } = context.switchToHttp().getRequest();

    // user must exist after JWT auth
    if (!user) {
      throw new ForbiddenException({
        success: false,
        message: 'User not found in request.',
        errorCode: 'AUTH_403_NO_USER',
      });
    }

    // role validation
    if (!roles.includes(user.role)) {
      throw new ForbiddenException({
        success: false,
        message: 'You do not have permission to access this resource.',
        errorCode: 'AUTH_403_ROLE',
      });
    }

    return true;
  }
}