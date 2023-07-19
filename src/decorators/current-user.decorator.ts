import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { UserProfile } from 'src/user/entities/user.entity';

export const getCurrentUserByContext = (context: ExecutionContext): UserProfile => {
  if (context.getType() === 'http') {
    return context.switchToHttp().getRequest().user;
  }
  if (context.getType() === 'rpc') {
    return context.switchToRpc().getData().user;
  }
};

export const CurrentUser = createParamDecorator((_data: unknown, context: ExecutionContext) =>
  getCurrentUserByContext(context),
);
