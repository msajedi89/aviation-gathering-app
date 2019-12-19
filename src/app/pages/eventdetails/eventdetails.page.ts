import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const EVENTIDFORSHOWDETAILS = 'eventIdForShowDetails';

@Component({
  selector: 'app-eventdetails',
  templateUrl: './eventdetails.page.html',
  styleUrls: ['./eventdetails.page.scss'],
})
export class EventdetailsPage implements OnInit {

  eventID = '';
  event: any = '';
  eventImage = '../../../assets/material-design-background.jpg';
  enableBookButton = false;

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router) { }

  ngOnInit() {

    this.storage.get(EVENTIDFORSHOWDETAILS).then(eventIdResult => {
      this.eventID = eventIdResult;
      this.network.getEventByEventID(this.eventID).then(eventData => {
        const jsonArray = eventData;
        this.event = jsonArray[0];
        console.log('the Event recieved...');

        this.eventImage = this.network.mainEventImagesUrl + this.event.Img;

        // enable or disable Book Your Ticket Button
        this.enableBookTicketButton();
      }).catch(err => {
        alert(JSON.stringify(err));
      });
    });
  }

  goBack() {
    this.router.navigate(['home']);
  }

  // enable or disable Book Your Ticket Button
  enableBookTicketButton() {
    let normalSeats = parseInt(this.event.NormalSeats);
    let vipSeats = parseInt(this.event.VipSeats);
    if(this.event.OpenTicket == '1') {
      this.enableBookButton = true;

      if(this.event.IsRanked == '1') {
        if((normalSeats > 0) || (vipSeats > 0)) {
          this.enableBookButton = true;
        } else {
          this.enableBookButton = false;
        }
      } else {
        if(normalSeats > 0) {
          this.enableBookButton = true;
        } else {
          this.enableBookButton = false;
        }
      }
    }
  }


  // go for booking ticket
  bookTicket() {
    this.router.navigate(['bookticket']);
  }

}
