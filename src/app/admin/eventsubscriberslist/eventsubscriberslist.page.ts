import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const EVENT_FOR_SHOWING_SUBSCRIBERS = 'eventforsubscribers';
const TICKET_ID_TO_SHOW_DETAILS = 'ticketidtoshowdetails';
const FROM_WHERE = 'fromwhere';

@Component({
  selector: 'app-eventsubscriberslist',
  templateUrl: './eventsubscriberslist.page.html',
  styleUrls: ['./eventsubscriberslist.page.scss'],
})
export class EventsubscriberslistPage implements OnInit {

  event: any = '';
  eventID = '';
  eventImage = '';

  eventSubscribers: any = '';

  userProfileImageURL = '';

  isLoaded = false;

  pdfLink = '';
  pdfLinkIsReady = false;

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private alertCtrl: AlertController) { }

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
          console.log(JSON.stringify(err));
          this.presentAlert('Attention', 'Please check your internet connection!');
        });
      });
    });
  }

  goBack() {
    this.router.navigate(['eventslist']);
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

  showDetails(ticketID) {
    this.storage.set(TICKET_ID_TO_SHOW_DETAILS, ticketID).then(() => {
      this.storage.set(FROM_WHERE, 'eventsubscriberslist').then(() => {
        this.router.navigate(['ticketdetails']);
      });
    });
  }

  downloadAsPDF() {
    this.network.generatePDF(this.eventID, this.event.Title).then(generatingResult => {
      console.log(generatingResult);
      this.pdfLink = 'http://' + generatingResult;
      this.pdfLinkIsReady = true;
    }).catch(err => {
      console.log(JSON.stringify(err));
      this.presentAlert('Attention', 'Please check your internet connection!');
    });
  }
}
