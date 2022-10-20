import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { FirebaseApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, UserCredential } from '@firebase/auth';
import { FIREBASE_APP, FIREBASE_CONFIG } from '../../firebase.constants';
import { DecodedIdToken } from 'firebase-admin/lib/auth/token-verifier';
import { FirebaseAuthResponse, FirebaseConfig } from '../../interfaces';
import * as admin from 'firebase-admin';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class FirebaseAuthService {
  private readonly apiKey = process.env['FIREBASE_API_KEY'];
  private readonly refreshApiUrl = 'https://securetoken.googleapis.com/v1/token';
  private readonly _auth;

  constructor(
    @Inject(FIREBASE_APP) private readonly firebaseApp: FirebaseApp,
    @Inject(FIREBASE_CONFIG) private readonly firebaseConfig: FirebaseConfig,
    private readonly http: HttpService
  ) {
    this._auth = getAuth(this.firebaseApp);
  }

  async verifyIdToken(token: string, checkRevoked = true): Promise<DecodedIdToken> {
    return admin.auth().verifyIdToken(token, checkRevoked);
  }

  async createUserWithEmailAndPassword(email: string, password: string) {
    return this.getUserCredentialTokens(await createUserWithEmailAndPassword(this._auth, email, password));
  }

  async signInWithEmailAndPassword(email: string, password: string) {
    return this.getUserCredentialTokens(await signInWithEmailAndPassword(this._auth, email, password));
  }

  async refreshToken(refreshToken: string): Promise<FirebaseAuthResponse | null> {
    const params = new URLSearchParams({
      grant_type: 'refresh_token',
      refresh_token: refreshToken,
    });
    const res = await this.http
      .post(`${this.refreshApiUrl}?key=${this.apiKey}`, params.toString())
      .toPromise()
      .catch(() => {
        throw new UnauthorizedException();
      });
    return res && res.data ? { refreshToken: res.data.refresh_token, accessToken: res.data.access_token } : null;
  }

  private async getUserCredentialTokens(credential: UserCredential): Promise<FirebaseAuthResponse> {
    const accessToken = await credential.user.getIdToken();
    const refreshToken = credential.user.refreshToken;
    return {
      accessToken,
      refreshToken,
    };
  }
}
