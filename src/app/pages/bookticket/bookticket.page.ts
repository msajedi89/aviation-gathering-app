import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, AlertController, ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '../../services/authentication.service';

const EVENTIDFORSHOWDETAILS = 'eventIdForShowDetails';
const TOKEN_KEY = 'auth-token';
const TICKET_ID_TO_SHOW_DETAILS = 'ticketidtoshowdetails';

@Component({
  selector: 'app-bookticket',
  templateUrl: './bookticket.page.html',
  styleUrls: ['./bookticket.page.scss'],
})
export class BookticketPage implements OnInit {

  eventID = '';
  event: any = '';

  isLoggedIn = false;
  userInfo: any = '';
  userID = '2';
  userProfileImg = '';

  // event info variables
  eventImage = '';

  // ticket info variables
  isRanked = false;
  ticketType = 'normal';
  ticketCount = 1;
  seatsLeft = 0;
  seatPrice = 0;
  totalPrice = 0;

  // ticket inserted variable
  ticketInfo: any = '';

  adminInfo: any = '';
  adminDeviceId = '';

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private authService: AuthenticationService, private alertCtrl: AlertController, private toastCtrl: ToastController) { }

  ngOnInit() {

    // get yhe event Id from storage and event data from server
    this.storage.get(EVENTIDFORSHOWDETAILS).then(eventIdResult => {
      this.eventID = eventIdResult;
      this.network.getEventByEventID(this.eventID).then(eventData => {
        const jsonArray = eventData;
        this.event = jsonArray[0];
        console.log('the Event to show details: ' + this.event.EventID + ' ' + this.event.Title);

        // get the normal seats left
        this.seatsLeft = this.event.NormalSeats;
        this.seatPrice = this.event.NormalPrice;
        //this.totalPrice = this.event.NormalPrice;

        // get the event image
        this.eventImage = this.network.mainEventImagesUrl + this.event.Img;

        if (this.event.IsRanked == 1) {
          this.isRanked = true;
        }
      }).catch(err => {
        alert(JSON.stringify(err));
      });
    });

    // check user login state
    this.isLoggedIn = this.authService.isAuthenticated();
    console.log('the login status in book ticket is: ' + this.isLoggedIn);
    // get the user info if user logged in
    if (this.isLoggedIn) {
      this.storage.get(TOKEN_KEY).then(userData => {
        this.userInfo = userData;
        console.log('the user info is: ' + JSON.stringify(this.userInfo));

        this.userID = this.userInfo.UserID;
        this.userProfileImg = this.network.mainUserProfileImageUrl + this.userInfo.ProfileImg;
      });
    }

    // get the admin device id
    this.network.getUserByUserID('1').then(adminData => {
      const jsonArray3 = adminData;
      this.adminInfo = jsonArray3[0];
      this.adminDeviceId = this.adminInfo.DeviceID;
      console.log('the admin deviceID is : ' + this.adminDeviceId);
    }).catch(errAdmin => {
      console.log(JSON.stringify(errAdmin));
    });
  }

  goBack() {
    this.router.navigate(['eventdetails']);
  }

  login() {
    this.router.navigate(['login']);
  }

  async presentAlert(text) {
    const alertCt = await this.alertCtrl.create({
      message: text
    });

    alertCt.present();
  }

  async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });

    toast.present();
  }

  segmaentChangedToNormal($event,ticketCountInput) {
    this.ticketType = 'normal';
    console.log('ticket type is: ' + this.ticketType);
    this.seatsLeft = this.event.NormalSeats;
    this.seatPrice = this.event.NormalPrice;
    
    // calc total price
    this.ticketCount = parseInt(ticketCountInput);
    this.totalPrice = this.ticketCount * this.seatPrice;
  }

  segmaentChangedToVip($event,ticketCountInput) {
    this.ticketType = 'vip';
    console.log('ticket type is: ' + this.ticketType);
    this.seatsLeft = this.event.VipSeats;
    this.seatPrice = this.event.VipPrice;
    
    // calc total price
    this.ticketCount = parseInt(ticketCountInput);
    this.totalPrice = this.ticketCount * this.seatPrice;
  }



  // ************* Payment Button *************
  payment(ticketCountInput) {
    // check ticket count
    if ((ticketCountInput != '') && (ticketCountInput != null) && (ticketCountInput != '0')) {
      this.ticketCount = parseInt(ticketCountInput);
      // check seats left
      console.log('seatsLeft: ' + this.seatsLeft);
      console.log('ticketCount: ' + this.ticketCount);

      if (this.ticketCount <= this.seatsLeft) {
        this.totalPrice = this.ticketCount * this.seatPrice;
        console.log('proceed');
        console.log('CustomerID: ' + this.userID);
        console.log('EventID: ' + this.eventID);
        console.log('TicketType: ' + this.ticketType);

        // calc seats left for update event info
        let seatsLeftForUpdate = this.seatsLeft - this.ticketCount;

        this.network.addTicket(this.eventID, this.userID, this.ticketType, this.ticketCount, this.totalPrice, seatsLeftForUpdate).then(insertingResult => {
          const jsonArray = insertingResult;
          this.ticketInfo = jsonArray[0];
          console.log('the inserted ticket is: ' + JSON.stringify(this.ticketInfo));

          if (this.ticketInfo != "0") {
            this.presentToast('Your Ticket saved successfuly...');
            let ticketId = this.ticketInfo.TicketID;
            this.storage.set(TICKET_ID_TO_SHOW_DETAILS, ticketId).then(() => {

              // send a notification to inform admin about this ticket payment
              let ntfMsg = this.userInfo.Username  + ' has reserved ' + this.ticketCount + ' for ' + this.event.Title;
              this.network.sendNotification('Reserve Ticket', ntfMsg, this.userProfileImg, this.adminDeviceId, 'single device', '').then(() => {
                this.router.navigate(['paypalpage']);
              }).catch(errNtf => {
                console.log(JSON.stringify(errNtf));
              });
              
            });
          } else {
            this.presentAlert('Something goes wrong, please try again!!');
          }
        }).catch(err => {
          //this.presentAlert('Something goes wrong, please try again!!');
          this.presentAlert(JSON.stringify(err));
        });
      } else {
        this.presentAlert('Your Ticket Count is more than seats left!!');
      }
    } else {
      this.presentAlert('Please enter a valid number in Ticket Count field!!');
    }
  }

}
