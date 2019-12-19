import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const EVENT_FOR_SHOWING_SUBSCRIBERS = 'eventforsubscribers';

@Component({
  selector: 'app-eventslist',
  templateUrl: './eventslist.page.html',
  styleUrls: ['./eventslist.page.scss'],
})
export class EventslistPage implements OnInit {

  allEvents: any = '';
  eventsImageURL = '';

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    this.eventsImageURL = this.network.mainEventImagesUrl;

    this.network.getAllEventsForManaging().then(eventsData => {
      this.allEvents = eventsData;
      console.log('all Events recieved...');
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

  showEventSubscribers(event) {
    this.storage.set(EVENT_FOR_SHOWING_SUBSCRIBERS, event).then(() => {
      this.router.navigate(['eventsubscriberslist']);
    });
  }

}
