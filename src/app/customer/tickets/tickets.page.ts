import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const TOKEN_KEY = 'auth-token';
const TICKET_ID_TO_SHOW_DETAILS = 'ticketidtoshowdetails';
const FROM_WHERE = 'fromwhere';
const FROM_WHERE_PAYPAL = 'fromwherepaypal';

@Component({
  selector: 'app-tickets',
  templateUrl: './tickets.page.html',
  styleUrls: ['./tickets.page.scss'],
})
export class TicketsPage implements OnInit {

  allTickets: any = '';
  eventsImageURL = '';

  userInfo: any = '';
  userID = '';

  isLoaded = false;
  hasTicket = false;

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  ngOnInit() {

    this.storage.get(TOKEN_KEY).then(userData => {
      this.userInfo = userData;
      this.userID = this.userInfo.UserID;
      console.log('the userID to fetch its Tickets: ' + this.userID);

      // get the tickets
      this.network.getCustomerTicketsByUserID(this.userID).then(ticketData => {
        this.allTickets = ticketData;
        this.eventsImageURL = this.network.mainEventImagesUrl;

        // checking existing ticket
        if (this.allTickets != "0 result") {
          this.hasTicket = true;
          this.isLoaded = true;
        } else {
          this.presentAlert('You have no ticket. See our incoming events and book a ticket.');
          this.isLoaded = true;
        }
      }).catch(err => {
        this.presentAlert('Please check your internet connection');
      });
    });
  }

  async presentAlert(text) {
    const alertCt = await this.alertCtrl.create({
      message: text
    });

    alertCt.present();
  }

  goToSeeTickets() {
    this.router.navigate(['home']);
  }

  showDetails(ticketID) {
    this.storage.set(TICKET_ID_TO_SHOW_DETAILS, ticketID).then(() => {
      this.storage.set(FROM_WHERE, 'tickets').then(() => {
        this.router.navigate(['ticketdetails']);
      });
    });
  }

  payTicket(ticketID) {
    this.storage.set(TICKET_ID_TO_SHOW_DETAILS, ticketID).then(() => {
      this.storage.set(FROM_WHERE_PAYPAL, 'tickets').then(() => {
        this.router.navigate(['paypalpage']);
      });
    });
  }

}
