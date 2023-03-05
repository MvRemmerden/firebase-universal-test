import { Component } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { map } from 'rxjs';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
})
export class DashboardPageComponent {
  itemsLoaded: boolean = false;
  itemsArray: Array<any> = [];
  thread: any;
  user: any;
  constructor(database: AngularFireDatabase, public afAuth: AngularFireAuth) {
    database
      .list('/messages')
      .snapshotChanges()
      .pipe(
        map((actions) => {
          return actions.map((a: any) => {
            const data: any = a.payload.val();
            data['key'] = a.payload.key;
            return data;
          });
        })
      )
      .subscribe((event) => {
        var items = event;
        this.itemsArray = event;
        this.itemsLoaded = true;
        if (this.thread) {
          const threadItem = items.filter(
            (item: any) => item.key == this.thread.key
          );
          if (threadItem && threadItem[0].text != this.thread.text) {
            this.thread = items.filter(
              (item: any) => item.key == this.thread.key
            )[0];
          }
        }
      });
  }

  async signOut() {
    await this.afAuth.signOut();
  }

  openDrawer(item: any) {
    this.thread = item;
  }
}
