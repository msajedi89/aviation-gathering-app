import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const USER_FOR_DETAILS = 'userfordetails';

@Component({
  selector: 'app-customerslistfortickets',
  templateUrl: './customerslistfortickets.page.html',
  styleUrls: ['./customerslistfortickets.page.scss'],
})
export class CustomerslistforticketsPage implements OnInit {

  allCustomers: any = '';
  userImageURL = '';

  mySearch = '';

  isLoaded = false;

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  ngOnInit() {

    this.userImageURL = this.network.mainUserProfileImageUrl;
    this.getCustomers();
  }

  getCustomers() {
    this.network.getAllCustomersForManaging().then(usersData => {
      this.allCustomers = usersData;
      this.isLoaded = true;
      console.log('customers data recieved...');
    }).catch(err => {
      console.log(JSON.stringify(err));
      this.presentAlert('Attention', 'Please check your internet connection!!');
    });
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


  showCustomerTickets(userID) {
    this.storage.set(USER_FOR_DETAILS, userID).then(() => {
      this.router.navigate(['customertickets']);
    });
  }

}
