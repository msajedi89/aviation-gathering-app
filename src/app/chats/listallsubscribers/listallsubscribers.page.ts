import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const CUSTOMER_ID_FOR_SINGLE_CHAT = 'userchatidforsinglechat';
const FROM_WHERE = 'fromwhere';

@Component({
  selector: 'app-listallsubscribers',
  templateUrl: './listallsubscribers.page.html',
  styleUrls: ['./listallsubscribers.page.scss'],
})
export class ListallsubscribersPage implements OnInit {

  allCustomers: any = '';
  customerProfileImageURL = '';

  isLoaded = false;

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  ngOnInit() {

    this.network.getAllActiveCustomers().then(customersData => {
      this.allCustomers = customersData;
      this.customerProfileImageURL = this.network.mainUserProfileImageUrl;
      this.isLoaded = true;
      console.log('Customers list recieved...');
    }).catch(err => {
      console.log(JSON.stringify(err));
      this.presentAlert('Please check your internet connection!!');
    });
  }

  goBack() {
    this.router.navigate(['adminnewsinglechats']);
  }

  async presentAlert(text) {
    const alertCt = await this.alertCtrl.create({
      message: text
    });

    alertCt.present();
  }

  goForChat(userID) {
    this.storage.set(CUSTOMER_ID_FOR_SINGLE_CHAT, userID).then(() => {
      this.storage.set(FROM_WHERE, 'listallsubscribers').then(() => {
        this.router.navigate(['singlechat']);
      });
    });
  }

}
