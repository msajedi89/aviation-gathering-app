import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const ADD_OR_EDIT_EVENT = 'addoreditevent';
const EVENTID_FOR_EDIT = 'eventidforedit';

@Component({
  selector: 'app-manageevents',
  templateUrl: './manageevents.page.html',
  styleUrls: ['./manageevents.page.scss'],
})
export class ManageeventsPage implements OnInit {

  allEvents: any = '';
  eventsImageURL = '';

  isLoaded = false;

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  ngOnInit() {
    this.getEvents();
  }

  getEvents() {
    this.eventsImageURL = this.network.mainEventImagesUrl;

    this.network.getAllEventsForManaging().then(eventsData => {
      this.allEvents = eventsData;
      this.isLoaded = true;
      console.log('the events recieved...');
    }).catch(err => {
      console.log(JSON.stringify(err));
      this.presentAlert('Please check your internet connection!!');
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

  async presentAlert(text) {
    const alertCt = await this.alertCtrl.create({
      message: text
    });

    alertCt.present();
  }

  addEvent() {
    this.storage.set(ADD_OR_EDIT_EVENT, 'add').then(() => {
      this.router.navigate(['addoreditevent']);
    });
  }

  editEvent(eventID) {
    this.storage.set(EVENTID_FOR_EDIT, eventID).then(() => {
      this.storage.set(ADD_OR_EDIT_EVENT, 'edit').then(() => {
        this.router.navigate(['addoreditevent']);
      });
    });
  }

  disableEvent(eventID) {
    this.network.updateEventStatus(eventID, 0).then(updatingResult => {
      const jsonArray = updatingResult;
      if (jsonArray == 'Successful') {
        this.presentToast('Event has been disabled');
        this.getEvents();
      } else {
        alert('Something goes wrong, Please try again');
      }
    }).catch(err => {
      alert(JSON.stringify(err));
    });
  }

  enableEvent(eventID) {
    this.network.updateEventStatus(eventID, 1).then(updatingResult => {
      const jsonArray = updatingResult;
      if (jsonArray == 'Successful') {
        this.presentToast('Event has been enabled');
        this.getEvents();
      } else {
        alert('Something goes wrong, Please try again');
      }
    }).catch(err => {
      alert(JSON.stringify(err));
    });
  }

}
