import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const USER_FOR_DETAILS = 'userfordetails';
const TICKET_ID_TO_SHOW_DETAILS = 'ticketidtoshowdetails';
const FROM_WHERE = 'fromwhere';

@Component({
  selector: 'app-customertickets',
  templateUrl: './customertickets.page.html',
  styleUrls: ['./customertickets.page.scss'],
})
export class CustomerticketsPage implements OnInit {

  user: any = '';
  userID = '';
  userImageURL = '';

  customerTickets: any = '';

  isLoaded = false;
  ticketsRecieved = false;

  changeColor = true;

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  ngOnInit() {

    this.storage.get(USER_FOR_DETAILS).then(userResult => {
      this.user = userResult;
      this.userID = this.user.UserID;
      console.log('the userId for fetch its tickets: ' + this.userID);
      this.userImageURL = this.network.mainUserProfileImageUrl + this.user.ProfileImg;
      this.isLoaded = true;

      this.network.getCustomerTickets(this.userID).then(ticketsData => {
        this.customerTickets = ticketsData;
        this.ticketsRecieved = true;
        console.log('customer tickets recieved...');
      })
    });
  }

  goBack() {
    this.router.navigate(['customerslistfortickets']);
  }


  showTicketDetails(ticketID) {
    this.storage.set(FROM_WHERE, 'customertickets').then(() => {
      this.storage.set(TICKET_ID_TO_SHOW_DETAILS, ticketID).then(() => {
        this.router.navigate(['ticketdetails']);
      });
    });
  }

}
