import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const EVENT_FOR_SHOWING_SUBSCRIBERS = 'eventforsubscribers';
const CUSTOMER_ID_FOR_SINGLE_CHAT = 'userchatidforsinglechat';
const FROM_WHERE = 'fromwhere';

@Component({
  selector: 'app-eventsubscribers',
  templateUrl: './eventsubscribers.page.html',
  styleUrls: ['./eventsubscribers.page.scss'],
})
export class EventsubscribersPage implements OnInit {

  event: any = '';
  eventID = '';
  eventImage = '';

  eventSubscribers: any = '';

  userProfileImageURL = '';

  isLoaded = false;

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router) { }

  ngOnInit() {

    this.plt.ready().then(() => {

      this.userProfileImageURL = this.network.mainUserProfileImageUrl;
      
      // get the event from storage
      this.storage.get(EVENT_FOR_SHOWING_SUBSCRIBERS).then(eventData => {
        this.event = eventData;
        this.eventID = this.event.EventID;
        console.log('the event came to this page is::: ' + this.eventID);

        this.eventImage = this.network.mainEventImagesUrl + this.event.Img;

        // get get Active Event Subscribers
        this.network.getActiveEventSubscribers(this.eventID).then(subscribersData => {
          this.eventSubscribers = subscribersData;
          this.isLoaded = true;
          console.log('the Subscribers Data recieved...');
        }).catch(err => {
          alert(JSON.stringify(err));
        });
      });
    });
  }

  goBack() {
    this.router.navigate(['admindash']);
  }

  goForChat(userID) {
    this.storage.set(CUSTOMER_ID_FOR_SINGLE_CHAT, userID).then(() => {
      this.storage.set(FROM_WHERE, 'eventsubscribers').then(() => {
        this.router.navigate(['singlechat']);
      });
    });
  }

}
