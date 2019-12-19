import { Component } from '@angular/core';

import { Platform, ToastController, AlertController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { Router } from '@angular/router';
import { AuthenticationService } from '../app/services/authentication.service';
import { Storage } from '@ionic/storage';
import { NetworkEngineServiceService } from '../app/services/network-engine-service.service';
import { Push, PushObject, PushOptions } from '@ionic-native/push/ngx';

const TOKEN_KEY = 'auth-token';
const DEVICE_TOKEN_ID = 'device-id';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  showMenu = false;

  userLoginStatus = false;
  user: any = '';
  userProfileImage = '';
  /*user: any = {
    Name: 'Saeed',
    Family: 'Aldashti',
    Username: 'saeed.aldashti',
    UserType: 'admin'
  };*/

  whoIs = 'notUser';

  public adminPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Dashboard',
      url: '/admindash',
      icon: 'speedometer'
    },
    {
      title: 'Event Management',
      url: '/manageevents',
      icon: 'rocket'
    },
    {
      title: 'News Management',
      url: '/managenews',
      icon: 'logo-designernews'
    },
    {
      title: 'Customer Chats',
      url: '/adminnewsinglechats',
      icon: 'text'
    },
    {
      title: 'Group Chats',
      url: '/allgroupchats',
      icon: 'chatbubbles'
    },
    {
      title: 'Customer Bookings',
      url: '/customerslistfortickets',
      icon: 'bookmarks'
    },
    {
      title: 'Event Subscribers',
      url: '/eventslist',
      icon: 'card'
    },
    {
      title: 'Manage Customers',
      url: '/managecustomers',
      icon: 'people'
    },
    {
      title: 'Edit Profile',
      url: '/editprofile',
      icon: 'create'
    }
  ];

  public customerPages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'Tickets',
      url: '/tickets',
      icon: 'card'
    },
    {
      title: 'Chat with Admin',
      url: '/singlechat',
      icon: 'text'
    },
    {
      title: 'Event Chat Groups',
      url: '/allgroupchats',
      icon: 'chatbubbles'
    },
    {
      title: 'News',
      url: '/allnews',
      icon: 'logo-designernews'
    },
    {
      title: 'Edit Profile',
      url: '/editprofile',
      icon: 'create'
    }
  ];

  public pages = [
    {
      title: 'Home',
      url: '/home',
      icon: 'home'
    },
    {
      title: 'News',
      url: '/allnews',
      icon: 'logo-designernews'
    }
  ];

  constructor(private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar, private router: Router,
    private authService: AuthenticationService, private network: NetworkEngineServiceService, public storage: Storage, private push: Push,
    private toastCtrl: ToastController, private alertCtrl: AlertController
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      this.pushSetup();
    });
  }

  pushSetup() {
    /*
    // to check if we have permission
    this.push.hasPermission().then((res: any) => {
      if (res.isEnabled) {
        console.log('We have permission to send push notifications');
      } else {
        console.log('We do not have permission to send push notifications');
      }
    });

    // Create a channel (Android O and above). You'll need to provide the id, description and importance properties.
    this.push.createChannel({
      id: "testchannel1",
      description: "My first test channel",
      // The importance property goes from 1 = Lowest, 2 = Low, 3 = Normal, 4 = High and 5 = Highest.
      importance: 3
    }).then(() => console.log('Channel created'));

    // Delete a channel (Android O and above)
    this.push.deleteChannel('testchannel1').then(() => console.log('Channel deleted'));

    // Return a list of currently configured channels
    this.push.listChannels().then((channels) => console.log('List of channels', channels))
    */

    // ********** to initialize push notifications **********
    const options: PushOptions = {
      android: {
        senderID: '628372514616'
      },
      ios: {
        alert: 'true',
        badge: true,
        sound: 'false'
      }
    }

    const pushObject: PushObject = this.push.init(options);

    pushObject.on('notification').subscribe((notification: any) => {
      console.log('Received a notification', notification);
      //if user using app and push notification comes
      if (notification.additionalData.foreground) {
        // if application open, show popup
        this.presentAlert('New Notification', notification.message);
      } else {
        //if user NOT using app and push notification comes
        console.log('Push notification clicked');
      }
    });

    pushObject.on('registration').subscribe((registration: any) => {
      console.log('Device registered', registration);
      pushObject.subscribe("all");
      this.storage.set(DEVICE_TOKEN_ID, registration.registrationId).then(() => {
        let deviceTokenMsg = 'the device Token is: ' + registration.registrationId;
        // this.presentAlert('device Registered', deviceTokenMsg);
      });
    });

    pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));

  }

  async presentToast(text) {
    const toast = await this.toastCtrl.create({
      message: text,
      position: 'bottom',
      duration: 3000
    });

    toast.present();
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

  login() {
    this.router.navigate(['login']);
  }

  changeSideMenu() {
    // check user login
    this.userLoginStatus = this.authService.isAuthenticated();
    console.log('the user Login Status is in App Component: ' + this.userLoginStatus);

    this.storage.get(TOKEN_KEY).then(userData => {
      console.log('the userData is: ' + JSON.stringify(userData));
      this.user = userData;
      this.userProfileImage = this.network.mainUserProfileImageUrl + this.user.ProfileImg;

      // determine the userType for side menu pages list
      let userType = this.user.UserType;
      //this.whoIs = userType;
      if (userType == 'admin') {
        this.pages = this.adminPages;
      } else {
        this.pages = this.customerPages;
      }
    });
  }

  changeSideMenutoLogout() {
    this.userLoginStatus = false;
    this.user = '';
    this.pages = [
      {
        title: 'Home',
        url: '/home',
        icon: 'home'
      },
      {
        title: 'News',
        url: '/allnews',
        icon: 'logo-designernews'
      }
    ];
  }

  logout() {
    this.authService.logout().then(() => {
      this.changeSideMenutoLogout();
      this.router.navigate(['home']);
    });
  }
}
