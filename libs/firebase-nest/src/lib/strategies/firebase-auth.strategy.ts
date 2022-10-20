import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy, ExtractJwt } from 'passport-firebase-jwt';
import * as firebase from 'firebase-admin';
import { FirebaseAuthService } from '../services';

@Injectable()
export class FirebaseAuthStrategy extends PassportStrategy(Strategy, 'firebase-auth') {
  constructor(private firebaseAuth: FirebaseAuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    });
  }
  async validate(token: string) {
    const firebaseUser: firebase.auth.DecodedIdToken = await this.firebaseAuth.verifyIdToken(token).catch(err => {
      throw new UnauthorizedException(err.message);
    });
    if (!firebaseUser) {
      throw new UnauthorizedException();
    }

    return firebaseUser;
  }
}
