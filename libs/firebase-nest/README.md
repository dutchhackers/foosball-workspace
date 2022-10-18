# firebase-nest

The goal of firebase-nest is to serve as an implementation layer to simplify the use of Firebase throughout the codebase.

## How to use

Add the module to the imports section of the module you want to include the lib in. Make sure to pass the project settings in the forRoot.

```javascript
@Module({
  imports: [
    FirebaseNestModule.forRoot({
      apiKey: "API_KEY",
      authDomain: "PROJECT_ID.firebaseapp.com",
      projectId: "PROJECT_ID",
      storageBucket: "PROJECT_ID.appspot.com",
    }),
    ...
  ],
})
export class AppModule {}
```

### Services

Inject the FirebaseAuthService in the class or service where you want to interact with Firebase Auth.

```javascript
@Injectable()
export class AuthService {
  constructor(private firebaseAuth: FirebaseAuthService) {}

  async register({ email, password }: { email: string; password: string }) {
    return this.firebaseAuth.createUserWithEmailAndPassword(email, password).then(async user => {
      return user;
    });
  }

  async login({ email, password }: { email: string; password: string }) {
    return this.firebaseAuth.signInWithEmailAndPassword(email, password).then(async user => {
      return user;
    });
  }
}
```

### Interceptors

Annotate controller methods with the FirebaseInterceptor to catch Firebase related errors

```javascript
@Post('login')
@UseInterceptors(FirebaseInterceptor)
async login(@Body() body) {
  return await this.authService.login(body);
}
```

### Guards

In order to protect certain endpoints or to retrieve user context from the Bearer, annotate the controller methods with the FirebaseAuthGuard

```javascript
@UseGuards(FirebaseAuthGuard)
@Get('me')
getData(@User() loggedInUser) {
  return loggedInUser;
}
```

### Strategy

Make sure to provide the FirebaseAuthStrategy in the module where Bearer headers should be validated

```javascript
@Module({
  providers: [FirebaseAuthStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
```
