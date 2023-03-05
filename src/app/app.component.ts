import { Component, Inject, Optional } from '@angular/core';
import { REQUEST, RESPONSE } from '@nguniversal/express-engine/tokens';
import { Request, Response } from 'express';
import type { app } from 'firebase-admin';
import { FIREBASE_ADMIN } from './app.module';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'firebase-universal-test';

  constructor(
    @Optional() @Inject(REQUEST) request: Request,
    @Optional() @Inject(RESPONSE) response: Response,
    @Optional() @Inject(FIREBASE_ADMIN) admin: app.App,
    private afAuth: AngularFireAuth
  ) {
    if (request && request.headers) {
      console.log(request.headers);
    }
    if (response && response.locals) {
      console.log(response.locals);
    }
  }
}
