import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const EVENTID_FOR_SHOWING_SUBSCRIBERS = 'eventidforsubscribers';
const EVENT_FOR_SHOWING_SUBSCRIBERS = 'eventforsubscribers';

@Component({
  selector: 'app-admindash',
  templateUrl: './admindash.page.html',
  styleUrls: ['./admindash.page.scss'],
})
export class AdmindashPage implements OnInit {

  activeEvents: any = '';
  eventImageURL = '';

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router) { }

  ngOnInit() {

    this.eventImageURL = this.network.mainEventImagesUrl;

    // get the active events
    this.network.getActiveEventsForHomePage().then(eventsData => {
      this.activeEvents = eventsData;
      console.log('avtive events recieved...');
    }).catch(err => {
      alert(JSON.stringify(err));
    });
  }

  showSubscribers(event) {
    this.storage.set(EVENT_FOR_SHOWING_SUBSCRIBERS, event).then(()=> {
      this.router.navigate(['eventsubscribers']);
    });
  }

}
