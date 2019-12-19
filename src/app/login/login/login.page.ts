import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '../../services/authentication.service';
import { AppComponent } from '../../../app/app.component';

const DEVICE_TOKEN_ID = 'device-id';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  userInfo: any = '';
  errorMsg = '';

  deviceId = '';

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private authService: AuthenticationService, public appComponent: AppComponent) { }

  ngOnInit() {

    // get the device id
    this.storage.get(DEVICE_TOKEN_ID).then(deviceIdResult => {
      this.deviceId = deviceIdResult;
      console.log('the device ID is: ' + this.deviceId);
    });
  }

  goBack() {
    this.router.navigate(['home']);
  }

  login(username, password) {
    if ((username != '') && (username != null)) {
      this.errorMsg = '';

      if ((password != '') && (password != null)) {
        this.errorMsg = '';

        this.network.getUserByUsername(username).then(userData => {
          const jsonArray = userData;
          this.userInfo = jsonArray[0];
          console.log('the userInfo fetched: ' + JSON.stringify(this.userInfo));

          // check username
          if (this.userInfo != '0') {

            this.errorMsg = ''

            // check password
            if (this.userInfo.Pass == password) {
              this.errorMsg = '';

              // check the user is enabeled
              if (this.userInfo.Status == 1) {
                this.errorMsg = '';
                // ********** Allow to enter ***********
                // save the admin device id to database
                let userID = this.userInfo.UserID;
                this.network.updateAdminDeviceID(userID, this.deviceId).then(updatingResult => {
                  console.log('the result of updating admin device id: ' + JSON.stringify(updatingResult));
                  this.authService.login(this.userInfo).then(() => {
                    this.appComponent.changeSideMenu();
                    this.router.navigate(['home']);
                  });
                }).catch(err => {
                  console.log(JSON.stringify(err));
                });
              } else {
                this.errorMsg = 'This user has been disabled!';
              }
            } else {
              this.errorMsg = 'The password is incorrect!';
            }
          } else {
            this.errorMsg = 'The username is incorrect!';
          }
        }).catch(err => {
          alert(JSON.stringify(err));
        });
      } else {
        this.errorMsg = 'Please enter your Password!';
      }
    } else {
      this.errorMsg = 'Please enter your Username!';
    }
  }

}
