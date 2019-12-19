import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const USERID_FOR_DETAILS = 'useridfordetails';

@Component({
  selector: 'app-customerdetails',
  templateUrl: './customerdetails.page.html',
  styleUrls: ['./customerdetails.page.scss'],
})
export class CustomerdetailsPage implements OnInit {

  user: any = '';
  userID = '';
  userImageURL = '';

  isLoaded = false;

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  ngOnInit() {

    this.storage.get(USERID_FOR_DETAILS).then(userIdResult => {
      this.userID = userIdResult;
      console.log('the user ID to show details: ' + this.userID);

      this.network.getUserByUserID(this.userID).then(userData => {
        const jsonArray = userData;
        this.user = jsonArray[0];
        console.log('customer data recieved...');

        this.userImageURL = this.network.mainUserProfileImageUrl + this.user.ProfileImg;
      }).catch(err => {
        console.log(JSON.stringify(err));
        this.presentAlert('Attention', 'Please check your internet connection!!');
      });
    });
  }

  goBack() {
    this.router.navigate(['managecustomers']);
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

}
