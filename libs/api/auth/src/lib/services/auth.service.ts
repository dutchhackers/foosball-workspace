import { Injectable } from '@nestjs/common';
import { FirebaseAuthService } from '@foosball/firebase-nest';

@Injectable()
export class AuthService {
  constructor(private readonly firebaseAuth: FirebaseAuthService) {}

  async register({ email, password }: { email: string; password: string }) {
    return this.firebaseAuth.createUserWithEmailAndPassword(email, password).then(credential => {
      return credential;
    });
  }

  async login({ email, password }: { email: string; password: string }) {
    return this.firebaseAuth.signInWithEmailAndPassword(email, password).then(credential => {
      return credential;
    });
  }

  async refresh({ refreshToken }: { refreshToken: string }) {
    return this.firebaseAuth.refreshToken(refreshToken).then(res => {
      if (res) {
        const { accessToken, refreshToken } = res;
        return {
          accessToken,
          refreshToken,
        };
      }
      return null;
    });
  }
}
