import { Inject, NgModule, Optional } from '@angular/core';
import { ServerModule } from '@angular/platform-server';

import { AppModule } from './app.module';
import { AppComponent } from './app.component';

import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { Request, Response } from 'express';

import * as admin from 'firebase-admin';
import { FIREBASE_ADMIN } from './app.module';

@NgModule({
  imports: [AppModule, ServerModule],
  bootstrap: [AppComponent],
  providers: [
    {
      provide: FIREBASE_ADMIN,
      useFactory: () => admin.apps[0] || admin.initializeApp(),
    },
    { provide: REQUEST, useValue: {} },
    { provide: RESPONSE, useValue: {} },
  ],
})
export class AppServerModule {
  constructor(
    @Optional() @Inject(REQUEST) request: Request,
    @Optional() @Inject(RESPONSE) response: Response
  ) {
    if (request && request.headers) {
      console.log(request.headers);
    }
    if (response && response.locals) {
      console.log(response.locals);
    }
  }
}
