import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const TOKEN_KEY = 'auth-token';
const CUSTOMER_ID_FOR_SINGLE_CHAT = 'userchatidforsinglechat';
const FROM_WHERE = 'fromwhere';

@Component({
  selector: 'app-adminnewsinglechats',
  templateUrl: './adminnewsinglechats.page.html',
  styleUrls: ['./adminnewsinglechats.page.scss'],
})
export class AdminnewsinglechatsPage implements OnInit {

  user: any = '';
  userID = '';

  allNewChats: any = '';
  allCustomers: any = [];
  customerProfileImageURL = '';

  isLoaded = false;

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  ngOnInit() {

    this.customerProfileImageURL = this.network.mainUserProfileImageUrl;

    // get the user logged in
    this.storage.get(TOKEN_KEY).then(userData => {
      this.user = userData;
      this.userID = this.user.UserID;

      this.network.getNewCustomerChatMsgsForAdmin(this.userID).then(customersData => {
        this.allNewChats = customersData;
        //console.log('the customer: ' + JSON.stringify(this.allNewChats));
        this.isLoaded = true;
        console.log('customers list recieved...');

        if (this.allNewChats != '0 result') {
          this.distinctCustomer();
        }
      }).catch(err => {
        console.log(JSON.stringify(err));
        this.presentAlert('Please check your internet connection!!');
      });
    });
  }

  async presentAlert(text) {
    const alertCt = await this.alertCtrl.create({
      message: text
    });

    alertCt.present();
  }

  // distinct customers
  distinctCustomer() {
    let customer = this.allNewChats[0];
    this.allCustomers.push(customer);
    
    for (let i = 1; i < this.allNewChats.length; i++) {
      let element = this.allNewChats[i];
      let userChatID = element.UserChat;
      let found = false;
      for (let j = 0; j < this.allCustomers.length; j++) {
        let element2 = this.allCustomers[j];
        if (element2.UserChat == userChatID) {
          found = true;
        }
      }

      if (found == false) {
        this.allCustomers.push(element);
      }
    }

    //console.log('the allCustomers: ' + JSON.stringify(this.allCustomers));
  }

  goForChat(userChatID) {
    this.storage.set(FROM_WHERE, 'adminnewsinglechats').then(() => {
      this.storage.set(CUSTOMER_ID_FOR_SINGLE_CHAT, userChatID).then(() => {
        this.router.navigate(['singlechat']);
      });
    });
  }

  showAllCustomers() {
    this.router.navigate(['listallsubscribers']);
  }

}
