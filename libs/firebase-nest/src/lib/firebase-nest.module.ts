import { DynamicModule, Module, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { deleteApp, getApps, initializeApp } from '@firebase/app';
import { initializeApp as initializeAdminApp } from 'firebase-admin/app';
import { FirebaseConfig } from './interfaces';
import { FirebaseAuthService } from './services';
import { FIREBASE_APP, FIREBASE_CONFIG } from './firebase.constants';
import { FirebaseInterceptor } from './interceptors';
import * as admin from 'firebase-admin';
import { FirebaseAuthGuard } from './guards';
import { HttpModule } from '@nestjs/axios';

const INTERCEPTORS = [FirebaseInterceptor];
const SERVICES = [FirebaseAuthService];
const GUARDS = [FirebaseAuthGuard];

@Module({})
export class FirebaseNestModule implements OnApplicationShutdown, OnApplicationBootstrap {
  async onApplicationShutdown() {
    for (const app of getApps()) {
      const name = app.name;
      deleteApp(app)
        .then(function () {
          console.log('App ' + name + ' deleted successfully');
        })
        .catch(function (error) {
          console.log('Error deleting app ' + name + ':', error);
        });
    }
  }

  async onApplicationBootstrap() {
    // Initialize firebase-admin
    initializeAdminApp({
      credential: admin.credential.applicationDefault(),
    });
  }

  static forRoot(config: FirebaseConfig): DynamicModule {
    return {
      module: FirebaseNestModule,
      global: true,
      imports: [HttpModule],
      providers: [
        ...SERVICES,
        ...INTERCEPTORS,
        ...GUARDS,
        {
          provide: FIREBASE_CONFIG,
          useValue: config,
        },
        {
          provide: FIREBASE_APP,
          inject: [FIREBASE_CONFIG],
          useFactory: async (config: FirebaseConfig) => initializeApp(config, config.appName),
        },
      ],
      exports: [...SERVICES, ...INTERCEPTORS, ...GUARDS],
    };
  }
}
