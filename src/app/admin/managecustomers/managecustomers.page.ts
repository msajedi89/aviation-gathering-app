import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const USERID_FOR_DETAILS = 'useridfordetails';

@Component({
  selector: 'app-managecustomers',
  templateUrl: './managecustomers.page.html',
  styleUrls: ['./managecustomers.page.scss'],
})
export class ManagecustomersPage implements OnInit {

  allCustomers: any = '';
  userImageURL = '';

  mySearch = '';

  isLoaded = false;

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  ngOnInit() {

    this.getCustomers();
  }

  getCustomers() {
    this.network.getAllCustomersForManaging().then(usersData => {
      this.allCustomers = usersData;
      this.isLoaded = true;
      this.userImageURL = this.network.mainUserProfileImageUrl;
      console.log('customers data recieved...');
    }).catch(err => {
      console.log(JSON.stringify(err));
      this.presentAlert('Attention', 'Please check your internet connection!!');
    });
  }

  async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });

    toast.present();
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

  disableUser(userID) {
    this.network.updateUserStatus(userID, 0).then(updatingResult => {
      const jsonArray = updatingResult;
      if (jsonArray == 'Successful') {
        this.presentToast('Customer Account has been disabled');
        this.getCustomers();
      } else {
        this.presentAlert('Attention', 'Something goes wrong, Please try again!!');
      }
    }).catch(err => {
      console.log(JSON.stringify(err));
      this.presentAlert('Attention', 'Please check your internet connection!!');
    });
  }


  enableUser(userID) {
    this.network.updateUserStatus(userID, 1).then(updatingResult => {
      const jsonArray = updatingResult;
      if (jsonArray == 'Successful') {
        this.presentToast('Customer Account has been enabled');
        this.getCustomers();
      } else {
        this.presentAlert('Attention', 'Something goes wrong, Please try again!!');
      }
    }).catch(err => {
      console.log(JSON.stringify(err));
      this.presentAlert('Attention', 'Please check your internet connection!!');
    });
  }


  showDetails(userID) {
    this.storage.set(USERID_FOR_DETAILS, userID).then(() => {
      this.router.navigate(['customerdetails']);
    });
  }


  // Filter Customers by thier Family
  updateCustomers() {
    if (this.mySearch != '') {
      console.log('my Search: ' + this.mySearch);
      this.network.filterCustomerByFamily(this.mySearch).then(data => {
        console.log('I recieved Customers: ' + JSON.stringify(data));
        this.allCustomers = data;
      });
    } else {
      this.getCustomers();
    }
  }

}
