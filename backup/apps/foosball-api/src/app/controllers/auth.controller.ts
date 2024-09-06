import { User } from '@foosball/api/auth';
import { Body, Controller, Get, Post, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthService } from '@foosball/api/auth';
import { FirebaseInterceptor, FirebaseAuthGuard } from '@foosball/firebase-nest';

@Controller('')
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(FirebaseAuthGuard)
  @Get('me')
  getData(@User() loggedInUser) {
    return loggedInUser;
  }

  @Post('register')
  @UseInterceptors(FirebaseInterceptor)
  async register(@Body() body) {
    await this.authService.register(body);
  }

  @Post('login')
  @UseInterceptors(FirebaseInterceptor)
  async login(@Body() body) {
    return await this.authService.login(body);
  }

  @Post('refresh')
  @UseInterceptors(FirebaseInterceptor)
  async refresh(@Body() body) {
    return await this.authService.refresh(body);
  }
}
