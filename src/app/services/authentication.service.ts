import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Platform, NavController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
//import { AppComponent } from '../../app/app.component';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  authenticationState = new BehaviorSubject(false);
  userInfo = '';

  constructor(private plt: Platform, private navCtrl: NavController, public storage: Storage) { 

    this.plt.ready().then(() => {
      this.checkToken();
    });
  }

  login(userInformation): Promise<any> {
    return this.storage.set(TOKEN_KEY, userInformation).then(() => {
      //console.log('the user Login Status in Service: ' + userInformation);
      this.authenticationState.next(true);
      console.log('the user Login Status in Service: ' + JSON.stringify(this.authenticationState));
    });
  }

  logout(): Promise<any> {
    return this.storage.remove(TOKEN_KEY).then(() => {
      this.authenticationState.next(false);
      console.log('the user has been Logged out.');
    });
  }

  isAuthenticated() {
    return this.authenticationState.value;
  }

  checkToken() {
    return this.storage.get(TOKEN_KEY).then(result => {
      if (result) {
        this.authenticationState.next(true);
      }
    });
  }
}
