import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ISlackUser } from '../interfaces';

const buildSlackUserResponse = slackRequest => {
  return <ISlackUser>{
    userId: slackRequest?.user_id,
    userName: slackRequest?.user_name,
  };
};

export const SlackUser = createParamDecorator((data: unknown, context: ExecutionContext) => {
  return buildSlackUserResponse(context.switchToHttp().getRequest().body);
});
