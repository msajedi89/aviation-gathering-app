import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, ToastController, ActionSheetController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';

const ADD_OR_EDIT_EVENT = 'addoreditevent';
const EVENTID_FOR_EDIT = 'eventidforedit';

@Component({
  selector: 'app-addoreditevent',
  templateUrl: './addoreditevent.page.html',
  styleUrls: ['./addoreditevent.page.scss'],
})
export class AddorediteventPage implements OnInit {

  eventID = '';
  forAddOrEdit = '';
  event: any = '';

  isRanked = false;
  openTicket = true;

  eventImage: any = '../../../assets/aviation-logo.png';
  eventImageFileName = 'default.png';

  vipSeatsVal = 0;
  vipPriceVal = 0;

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private toastCtrl: ToastController, private actionSheetCtrl: ActionSheetController, private camera: Camera,
    private transfer: FileTransfer, private file: File, private alertCtrl: AlertController) { }

  ngOnInit() {

    this.storage.get(ADD_OR_EDIT_EVENT).then(forAddOrEditResult => {
      this.forAddOrEdit = forAddOrEditResult;
      console.log('for add or edit is: ' + this.forAddOrEdit);

      if (this.forAddOrEdit == 'edit') {
        this.storage.get(EVENTID_FOR_EDIT).then(eventIDResult => {
          this.eventID = eventIDResult;
          console.log('the eventID to edit::: ' + this.eventID);

          // get the event for editing it.
          this.network.getEventByEventID(this.eventID).then(eventData => {
            const jsonArray = eventData;
            this.event = jsonArray[0];

            // set IsRanked toggle
            if (this.event.IsRanked == 0) {
              this.isRanked = false;
            } else {
              this.isRanked = true;
            }

            // set the event image
            this.eventImage = this.network.mainEventImagesUrl + this.event.Img;
            this.eventImageFileName = this.event.Img;

            // set OpenTicket toggle
            if (this.event.OpenTicket == 0) {
              this.openTicket = false;
            } else {
              this.openTicket = true;
            }
          }).catch(err => {
            alert(JSON.stringify(err));
          });
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['manageevents']);
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


  // ************* Select event image ************
  async selectImage() {
    const actionSeet = await this.actionSheetCtrl.create({
      header: 'Select Image Source',
      buttons: [
        {
          text: 'Load From Library',
          handler: () => {
            // get picture method
            this.getPicture();
          }
        },
        {
          text: 'Use Camera',
          handler: () => {
            // take picture method
            this.takePicture();
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });

    await actionSeet.present();
  }

  takePicture() {
    let options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      encodingType: this.camera.EncodingType.JPEG,
      mediaType: this.camera.MediaType.PICTURE
    };

    this.camera.getPicture(options).then(imageData => {
      this.eventImage = 'data:image/jpeg;base64,' + imageData;

      // upload selected image
      this.uploadImage(this.eventImage);
    }).catch(err => {
      alert(JSON.stringify(err));
    });
  }

  getPicture() {
    let options: CameraOptions = {
      quality: 70,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
      saveToPhotoAlbum: false
    };

    this.camera.getPicture(options).then(imageData => {
      this.eventImage = 'data:image/jpeg;base64,' + imageData;

      // upload selected image
      this.uploadImage(this.eventImage);
    }).catch(err => {
      alert(JSON.stringify(err));
    });
  }

  createFileName() {
    let d = new Date(), n = d.getTime(), newFileName = n + '.jpg';
    return newFileName;
  }

  uploadImage(image) {
    const fileTransfer: FileTransferObject = this.transfer.create();

    let imageFilename = this.createFileName();

    let options: FileUploadOptions = {
      fileKey: 'photo',
      fileName: imageFilename,
      chunkedMode: false,
      httpMethod: 'post',
      mimeType: 'image/jpeg',
      headers: {}
    };

    fileTransfer.upload(image, this.network.mainUploadEventImagesAPI, options).then(() => {
      this.eventImageFileName = imageFilename;
      this.presentToast('Event image has been uploaded...');
    }).catch(err => {
      alert(JSON.stringify(err));
    });
  }

  testDate(startDate, endDate) {
    console.log('start date: ' + startDate);
    console.log('end date: ' + endDate);

    const startDateCorr = startDate.split('.')[0];
    console.log('startDateCorr: ' + startDateCorr);
  }

  saveChanges(title, summary, description, vipGuests, location, startDate, endDate, normalSeats, normalPrice, vipSeats, vipPrice) {
    if (summary == null) { summary = ''; }
    if (description == null) { description = ''; }
    if (vipGuests == null) { vipGuests = ''; }
    if (location == null) { location = ''; }

    // correction of IsRanked
    let isRankedNo = 0;
    if (this.isRanked == true) {
      isRankedNo = 1;
    } else {
      isRankedNo = 0;
    }

    // correction of Open Ticket
    let openTicketNo = 1;
    if (this.openTicket == false) {
      openTicketNo = 0;
    } else {
      openTicketNo = 1;
    }

    if ((title != null) && (title != '')) {
      if ((startDate != null) && (endDate != null)) {
        const startDateCorr = startDate.split('+')[0];
        const endDateCorr = endDate.split('+')[0];
        console.log('startDateCorr: ' + startDateCorr);
        console.log('endDateCorr: ' + endDateCorr);

        if (this.isRanked) {
          if ((normalSeats != '') && (normalPrice != '') && (normalSeats != null) && (normalPrice != null)) {
            if ((vipSeats != '') && (vipPrice != '') && (vipSeats != null) && (vipPrice != null)) {
              // Proceed to save data
              console.log('can save');
              this.network.addOrEditEvent(this.eventID, title, summary, description, vipGuests, startDateCorr, endDateCorr, normalSeats, isRankedNo, normalPrice, vipSeats, vipPrice, this.eventImageFileName, openTicketNo, location, this.forAddOrEdit).then(savingResult => {
                const jsonArray = savingResult;
                console.log('the resul of saving: ' + JSON.stringify(savingResult))
                if (jsonArray == 'Successful') {
                  this.presentToast('Event has been saved successfully...');

                  // ******* Send Notification *******
                  let msgBody = title + ' is on the way...';
                  let ntfImage = 'http://mobile.aviationgathering.ae/images/eventimages/' + this.eventImageFileName;
                  this.network.sendNotification('New Event', msgBody, ntfImage, '', 'topic', 'all').then(notificationResult => {
                    console.log(JSON.stringify(notificationResult));
                    this.presentAlert('Event Notification', 'All customers have been informed of this Event by a notification...');
                  }).catch(err => {
                    console.log(JSON.stringify(err));
                    //this.presentAlert('Error', 'Something goes wrong, please check your internet connection and try again!!');
                  });
                } else {
                  alert('Something goes wrong, Please try again');
                }
              }).catch(err => {
                console.log(JSON.stringify(err));
                this.presentAlert('Error', 'Something goes wrong, please check your internet connection and try again!!');
              });
            } else {
              alert('Please fill the VIP Seats informations!');
            }
          } else {
            alert('Please fill the Normal Seats informations!');
          }
        } else {
          if ((normalSeats != null) && (normalSeats != '') && (normalPrice != null) && (normalPrice != '')) {
            // Proceed to save data
            console.log('can save');
            let vipSeatsFake = 0;
            let vipPriceFake = 0;
            this.network.addOrEditEvent(this.eventID, title, summary, description, vipGuests, startDateCorr, endDateCorr, normalSeats, isRankedNo, normalPrice, vipSeatsFake, vipPriceFake, this.eventImageFileName, openTicketNo, location, this.forAddOrEdit).then(savingResult => {
              const jsonArray = savingResult;
              if (jsonArray == 'Successful') {
                this.presentToast('Event has been saved successfully...');

                // ******* Send Notification *******
                let msgBody = title + ' is on the way...';
                let ntfImage = 'http://mobile.aviationgathering.ae/images/eventimages/' + this.eventImageFileName;
                this.network.sendNotification('New Event', msgBody, ntfImage, '', 'topic', 'all').then(notificationResult => {
                  console.log(JSON.stringify(notificationResult));
                  this.presentAlert('Event Notification', 'All customers have been informed of this Event by a notification...');
                }).catch(err => {
                  console.log(JSON.stringify(err));
                  //this.presentAlert('Error', 'Something goes wrong, please check your internet connection and try again!!');
                });
              } else {
                alert('Something goes wrong, Please try again');
              }
            }).catch(err => {
              console.log(JSON.stringify(err));
              this.presentAlert('Error', 'Something goes wrong, please check your internet connection and try again!!');
            });
          } else {
            alert('Please fill the Normal Seats informations!');
          }
        }
      } else {
        alert('Please choose the Dates!');
      }
    } else {
      alert('Please fill the Title!');
    }
  }

}
