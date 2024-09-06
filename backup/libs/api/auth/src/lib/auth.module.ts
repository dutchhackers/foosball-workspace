import { Module } from '@nestjs/common';
import { AuthService } from './services';
import { FirebaseAuthStrategy } from '@foosball/firebase-nest';

@Module({
  providers: [FirebaseAuthStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
