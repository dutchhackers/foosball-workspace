import { FirebaseAuthGuard, User } from '@foosball/api/auth';
import { Controller, Get, UseGuards } from '@nestjs/common';

@Controller('')
export class AuthController {
  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  getData(@User() loggedInUser) {
    return loggedInUser;
  }
}
