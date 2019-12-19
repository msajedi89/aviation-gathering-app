import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const TOKEN_KEY = 'auth-token';
const EVENT_TO_JOIN_GROUP_CHATS = 'eventidtojoingroupchats';

@Component({
  selector: 'app-allgroupchats',
  templateUrl: './allgroupchats.page.html',
  styleUrls: ['./allgroupchats.page.scss'],
})
export class AllgroupchatsPage implements OnInit {

  allEvents: any = '';
  eventsImageURL = '';

  isLoaded = false;

  user: any = '';
  userID = '';
  whoIs = '';
  eventID = '';

  allCustomerTickets: any = '';

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  ngOnInit() {

    this.eventsImageURL = this.network.mainEventImagesUrl;

    this.network.getActiveEventsForHomePage().then(eventsData => {
      this.allEvents = eventsData;
      this.isLoaded = true;
      console.log('all events recieveid...');
    }).catch(err => {
      console.log(JSON.stringify(err));
      this.presentAlert('Please check your internet connection!!');
    });
  }

  async presentAlert(text) {
    const alertCt = await this.alertCtrl.create({
      message: text
    });

    alertCt.present();
  }


  joinGroup(event) {
    this.storage.get(TOKEN_KEY).then(userData => {
      this.user = userData;
      this.userID = this.user.UserID;
      this.whoIs = this.user.UserType;

      // check customer has ticket for this event chat
      if (this.whoIs == 'customer') {
        this.eventID = event.EventID;
        console.log('the User Id to check Ticket: ' + this.userID);
        console.log('the Event Id to check Ticket: ' + this.eventID);

        this.network.getTicketsBasedOnEventIDandCustomerID(this.eventID, this.userID).then(ticketsResult => {
          this.allCustomerTickets = ticketsResult;
          console.log('allCustomerTickets recieveid...');

          if (this.allCustomerTickets != '0 result') {
            this.storage.set(EVENT_TO_JOIN_GROUP_CHATS, event).then(() => {
              this.router.navigate(['groupchats']);
            });
          } else {
            this.presentAlert('You can not join this event chat. Because you have no ticket for this event.');
          }
        }).catch(err => {
          console.log(JSON.stringify(err));
          this.presentAlert('Please check your internet connection!!');
        });
      } else {
        // go to event chat group as Admin
        this.storage.set(EVENT_TO_JOIN_GROUP_CHATS, event).then(() => {
          this.router.navigate(['groupchats']);
        });
      }
    });
  }

}
