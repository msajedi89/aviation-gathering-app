import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../services/network-engine-service.service';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { AuthenticationService } from '../services/authentication.service';
import { AppComponent } from '../app.component';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';

const TOKEN_KEY = 'auth-token';
const EVENTIDFORSHOWDETAILS = 'eventIdForShowDetails';
const NEWS_ID_TO_SHOW_DETAILS = 'newsidfordetails';
const FROM_WHERE_FOR_NEWS = 'fromwherefornews';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  userLoginStatus = false;
  user: any = '';
  userID = '';

  messagesCount = 0;

  activeEvents: any = '';
  eventsProfileImageUrl = '';

  allEvents: any = '';

  sliderConfig = {
    spaceBetween: 3,
    slidesPerView: 2.2
  };

  // news
  allNews: any = '';
  newsImageUrl = '';

  countdownX = '';
  days = 0;
  hours = 0;
  minutes: any;
  seconds: any;

  isLoadedActiveEvents = false;
  isLoadedAllEvents = false;
  isLoadedNews = false;

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private authService: AuthenticationService, public appComponent: AppComponent, private alertCtrl: AlertController,
    private _sanitizer: DomSanitizer) {

    // get the Avtive Events
    this.plt.ready().then(() => {
      // get the event's image url
      this.eventsProfileImageUrl = this.network.mainEventImagesUrl;
      this.newsImageUrl = this.network.mainNewsImagesUrl;

      this.network.getActiveEventsForHomePage().then(eventsData => {
        this.activeEvents = eventsData;
        console.log('the activeEvents recieved...');
        this.isLoadedActiveEvents = true;
      }).catch(err => {
        this.presentAlert(JSON.stringify(err));
        // alert(JSON.stringify(err));
      });

      this.network.getAllEvents().then(allEventsData => {
        this.allEvents = allEventsData;
        console.log('the allEvents recieved...');
        this.isLoadedAllEvents = true;
      }).catch(err => {
        console.log('error in recieving AllEvents: ' + JSON.stringify(err));
        // this.presentAlert('There is no internet Connection, Please check your connection!');
        // alert(JSON.stringify(err));
      });

      // get the latest news
      this.network.get7LatestNews().then(newsData => {
        this.allNews = newsData;
        this.isLoadedNews = true;
      }).catch(err => {
        console.log('error in recieving allNews: ' + JSON.stringify(err));
        // this.presentAlert('There is no internet Connection, Please check your connection!');
        // alert(JSON.stringify(err));
      });

      // check user login
      this.userLoginStatus = this.authService.isAuthenticated();
      console.log('the user Login Status in Homepage is: ' + this.userLoginStatus);
      if (this.userLoginStatus == true) {
        this.appComponent.changeSideMenu();

        // check for new messages in chat
        this.storage.get(TOKEN_KEY).then(userData => {
          this.user = userData;
          this.userID = this.user.UserID;
          console.log('the userID to check its Chat Msgs: ' + this.userID);
          this.network.checkUserHasNewMsg(this.userID).then(chatResults => {
            console.log('the chat result: ' + JSON.stringify(chatResults));
            const jsonArray = chatResults;
            this.messagesCount = jsonArray[0].NewMsgs;
          }).catch(err => {
            console.log(err);
          });
        });
      }

      // this.getCountDownMethod();

    });

  }

  getBackground(img) {
    let image = this.eventsProfileImageUrl + img;
    return this._sanitizer.bypassSecurityTrustStyle(`url(${image})`);
  }

  async presentAlert(text) {
    const alertCt = await this.alertCtrl.create({
      message: text
    });

    alertCt.present();
  }

  // click on the chat icon in header and go to see chat messages
  goToSingleChat() {
    this.router.navigate(['singlechat']);
  }


  // got to Event Details
  bookTicket(eventID) {
    this.storage.set(EVENTIDFORSHOWDETAILS, eventID).then(() => {
      this.router.navigate(['eventdetails']);
    });
  }

  // go for showing all news
  showMoreNews() {
    this.router.navigate(['allnews']);
  }


  // *********** Count down Java script **********
  getCountDownMethod() {
    let countDownDate = new Date("Oct 29, 2021 14:50:25").getTime();

    // Update the count down every 1 second
    let x = setInterval(function () {

      // Get todays date and time
      let now = new Date().getTime();

      // Find the distance between now and the count down date
      let distance = countDownDate - now;
      // Time calculations for days, hours, minutes and seconds
      let days = Math.floor(distance / (1000 * 60 * 60 * 24));
      let hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((distance % (1000 * 60)) / 1000);
      //console.log(now, "now", "countDownDate", countDownDate, "distance", distance, "days", days);

      // Output the result in an element with id="demo"
      document.getElementById("demo").innerHTML = days + "d " + hours + "h " + minutes + "m " + seconds + "s ";

      // If the count down is over, write some text 
      if (distance < 0) {
        clearInterval(x);
        document.getElementById("demo").innerHTML = "EXPIRED";
      }
    }, 1000);
  }


  showNewsDetail(newsID) {
    this.storage.set(FROM_WHERE_FOR_NEWS, 'home').then(() => {
      this.storage.set(NEWS_ID_TO_SHOW_DETAILS, newsID).then(() => {
        this.router.navigate(['newsdetails']);
      });
    });
  }

}
