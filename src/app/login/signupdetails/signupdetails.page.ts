import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const USERNAME_FOR_SIGNUP_DETAILS = 'usernamefordetails';

@Component({
  selector: 'app-signupdetails',
  templateUrl: './signupdetails.page.html',
  styleUrls: ['./signupdetails.page.scss'],
})
export class SignupdetailsPage implements OnInit {

  userInfo: any = '';
  username = '';

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.storage.get(USERNAME_FOR_SIGNUP_DETAILS).then(usernameResult => {
      this.username = usernameResult;
      console.log('the username came to this page: ' + this.username);

      this.network.getUserByUsername(this.username).then(userData => {
        const jsonArray = userData;
        this.userInfo = jsonArray[0];
        console.log('user Info recieved...');
      }).catch(err => {
        console.log(JSON.stringify(err));
        this.presentAlert('Attention', 'Please check your internet connection!!');
      });
    });
  }

  goBack() {
    this.router.navigate(['singup']);
  }

  async presentAlert(header, body) {
    const alertCt = await this.alertCtrl.create({
      header: header,
      subHeader: 'Aviation Gathering',
      message: body,
      buttons: ['OK']
    });

    alertCt.present();
  }

  goToLoginPage() {
    this.router.navigate(['login']);
  }

}
