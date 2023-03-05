import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

@Component({
  selector: 'app-about-page',
  templateUrl: './about-page.component.html',
})
export class AboutPageComponent {
  user: any;
  constructor(public afAuth: AngularFireAuth) {}

  async signOut() {
    await this.afAuth.signOut();
  }
}
