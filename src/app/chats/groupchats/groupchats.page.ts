import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, ToastController, AlertController, IonContent } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const TOKEN_KEY = 'auth-token';
const EVENT_TO_JOIN_GROUP_CHATS = 'eventidtojoingroupchats';

@Component({
  selector: 'app-groupchats',
  templateUrl: './groupchats.page.html',
  styleUrls: ['./groupchats.page.scss'],
})
export class GroupchatsPage implements OnInit {

  user: any = '';
  userSend = '';
  userProfileImgURL = '';
  chatName = '';
  userSendProfileImg = '';

  event: any = '';
  eventID = '';

  whoIs = '';
  isLoaded = false;

  allMsgs: any = [];

  msgInput = '';

  @ViewChild(IonContent, {static: false}) content: IonContent;

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  ngOnInit() {

    // get the user logged in
    this.storage.get(TOKEN_KEY).then(userData => {
      this.user = userData;
      this.userSend = this.user.UserID;
      this.whoIs = this.user.UserType;
      this.chatName = this.user.ChatName;
      this.userSendProfileImg = this.user.ProfileImg;
      console.log('the User Id came in: ' + this.userSend + ' and is: ' + this.whoIs);

      // get the event to fetch its chat messages
      this.storage.get(EVENT_TO_JOIN_GROUP_CHATS).then(eventData => {
        this.event = eventData;
        this.eventID = this.event.EventID;
        console.log('the Event Id to fetch its chat messages: ' + this.eventID);

        this.network.getEventChatMsgs(this.eventID, this.userSend, this.whoIs).then(messagesData => {
          if (messagesData != '0 result') {
            this.allMsgs = messagesData;
          }
          this.isLoaded = true;
          this.userProfileImgURL = this.network.mainUserProfileImageUrl;
          console.log('all chat msgs recieveid...');
        }).catch(err => {
          console.log(JSON.stringify(err));
          this.presentAlert('Please check your internet connection!!');
        });
      });
    });
  }

  goBack() {
    this.router.navigate(['allgroupchats']);
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
        UserID: this.userSend,
        Message: this.msgInput,
        CreatedAt: new Date(),
        ChatName: this.chatName,
        ProfileImg: this.userSendProfileImg
      }

      // send new message to server
      this.network.addNewGroupChatMsg(this.eventID, this.userSend, this.msgInput, this.whoIs).then(insertingResult => {
        const jsonArray = insertingResult;
          if (jsonArray == 'Successful') {
            this.allMsgs.push(newMsg);
            this.msgInput = '';
            setTimeout(() => {
              this.content.scrollToBottom(200);
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
