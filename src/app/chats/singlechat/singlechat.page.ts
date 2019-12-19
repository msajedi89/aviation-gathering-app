import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, ToastController, AlertController, IonContent } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const TOKEN_KEY = 'auth-token';
const CUSTOMER_ID_FOR_SINGLE_CHAT = 'userchatidforsinglechat';
const FROM_WHERE = 'fromwhere';

@Component({
  selector: 'app-singlechat',
  templateUrl: './singlechat.page.html',
  styleUrls: ['./singlechat.page.scss'],
})
export class SinglechatPage implements OnInit {

  user: any = '';
  userGetInfo: any = '';
  userSend = '';
  userGet = '';
  userChat = '';
  userProfileImgURL = '';
  userSendProfileImg = '';
  userSendName = '';
  userGetNameFamily = ''

  whoIs = '';
  isLoaded = false;
  fromWhere = '';

  allMsgs: any = [];

  msgInput = '';

  isFirstTime = false;

  // notification variables
  userSendDeviceId = '';
  userGetDeviceId = '';

  @ViewChild(IonContent, { static: false }) content: IonContent;

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  ngOnInit() {

    // get the enter user
    this.storage.get(TOKEN_KEY).then(userData => {
      this.user = userData;
      this.userSend = this.user.UserID;
      console.log('the user came in: ' + this.userSend);
      this.whoIs = this.user.UserType;
      this.userSendProfileImg = this.user.ProfileImg;
      console.log('who is in the page: ' + this.whoIs);
      this.userSendDeviceId = this.user.DeviceID;

      if (this.whoIs == 'customer') {
        this.userSendName = this.user.Username;
        // if the user came in is the customer
        this.userChat = this.userSend;
        this.userGet = '1';
        this.network.getCustomerChatByUserID(this.userChat, 1, 'customer').then(chatMsgsData => {
          if (chatMsgsData != '0 result') {
            this.allMsgs = chatMsgsData;
          }
          this.userProfileImgURL = this.network.mainUserProfileImageUrl;
          this.isLoaded = true;
          console.log('chat messages recieved...');
        }).catch(err => {
          console.log(JSON.stringify(err));
          this.presentAlert('Please check your internet connection!!');
        });

        // get the admin info to determine the admin device id
        this.network.getUserByUserID(1).then(adminData => {
          const jsonArray2 = adminData;
          this.userGetInfo = jsonArray2[0];
          this.userGetDeviceId = this.userGetInfo.DeviceID;
          this.userGetNameFamily = this.userGetInfo.Name + ' ' + this.userGetInfo.Family;
        }).catch(err => {
          console.log(JSON.stringify(err));
          //this.presentAlert('Please check your internet connection!!');
        });
      } else {
        // if the user came in is the admin
        this.userSendName = this.user.Name + ' ' + this.user.Family;
        // read the customer id from storage
        this.storage.get(CUSTOMER_ID_FOR_SINGLE_CHAT).then(userChatIDResult => {
          this.userGet = userChatIDResult;
          this.userChat = userChatIDResult;

          this.network.getCustomerChatByUserID(this.userChat, this.userSend, 'admin').then(chatMsgsData => {
            if (chatMsgsData != '0 result') {
              this.allMsgs = chatMsgsData;
            }
            this.userProfileImgURL = this.network.mainUserProfileImageUrl;
            this.isLoaded = true;
            console.log('chat messages recieved...');
          }).catch(err => {
            console.log(JSON.stringify(err));
            this.presentAlert('Please check your internet connection!!');
          });

          // get the admin info to determine the admin device id
          this.network.getUserByUserID(this.userGet).then(customerData => {
            const jsonArray2 = customerData;
            this.userGetInfo = jsonArray2[0];
            this.userGetDeviceId = this.userGetInfo.DeviceID;
            this.userGetNameFamily = this.userGetInfo.Name + ' ' + this.userGetInfo.Family;
          }).catch(err => {
            console.log(JSON.stringify(err));
            //this.presentAlert('Please check your internet connection!!');
          });
        });
      }
    });

    // get the root for back button
    this.storage.get(FROM_WHERE).then(fromWhereResult => {
      this.fromWhere = fromWhereResult;
    });
  }

  goBack() {
    if (this.whoIs == 'customer') {
      this.router.navigate(['home']);
    } else {
      if (this.fromWhere == 'eventsubscribers') {
        this.router.navigate(['eventsubscribers']);
      } else if (this.fromWhere == 'listallsubscribers') {
        this.router.navigate(['listallsubscribers']);
      } else if (this.fromWhere == 'adminnewsinglechats') {
        this.router.navigate(['adminnewsinglechats']);
      } else {
        this.router.navigate(['home']);
      }
    }
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

  sendMessage() {
    if ((this.msgInput != null) && (this.msgInput != '')) {

      let newMsg = {
        UserSend: this.userSend,
        UserGet: this.userGet,
        Message: this.msgInput,
        CreatedAt: new Date(),
        ProfileImg: this.userSendProfileImg
      };

      // send new message to server
      console.log('the userChat: ' + this.userChat);
      console.log('the userSend: ' + this.userSend);
      console.log('the userGet: ' + this.userGet);
      console.log('the msgInput: ' + this.msgInput);

      this.network.addNewSingleChatMsg(this.userChat, this.userSend, this.userGet, this.msgInput).then(insertingResult => {
        const jsonArray = insertingResult;
        if (jsonArray == 'Successful') {
          this.allMsgs.push(newMsg);
          let userMsg = this.msgInput;
          this.msgInput = '';
          setTimeout(() => {
            this.content.scrollToBottom(200);
          });

          // ******* Send Notification *******
          let ntfImage = 'http://mobile.aviationgathering.ae/images/profileimages/' + this.userSendProfileImg;
          this.network.sendNotification(this.userSendName, userMsg, ntfImage, this.userGetDeviceId, 'single device', '').then(notificationResult => {
            console.log(JSON.stringify(notificationResult));
          }).catch(err => {
            console.log(JSON.stringify(err));
            //this.presentAlert('Error', 'Something goes wrong, please check your internet connection and try again!!');
          });
        } else {
          this.presentAlert('Something goes wrong, Please try again');
        }
      }).catch(err => {
        console.log(JSON.stringify(err));
        this.presentAlert('Please check your internet connection');
      });
    } else {
      this.presentAlert('Please type something, you can not send empty message!!');
    }
  }

}
