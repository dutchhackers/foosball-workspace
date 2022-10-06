import { Module } from '@nestjs/common';
import { FirebaseAuthStrategy } from './strategies/firebase-auth.strategy';

@Module({
  controllers: [],
  providers: [FirebaseAuthStrategy],
  exports: [],
})
export class AuthModule {}
