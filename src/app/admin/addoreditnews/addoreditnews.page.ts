import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, ToastController, ActionSheetController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';

const ADD_OR_EDIT_NEWS = 'addoreditnews';
const NEWSID_FOR_EDIT = 'newsidforedit';

@Component({
  selector: 'app-addoreditnews',
  templateUrl: './addoreditnews.page.html',
  styleUrls: ['./addoreditnews.page.scss'],
})
export class AddoreditnewsPage implements OnInit {

  forAddOrEdit = '';

  news: any = '';
  newsID = '';
  newsImage: any = '../../../assets/aviation-logo.png';
  newsImageFileName = 'default.png';

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private toastCtrl: ToastController, private actionSheetCtrl: ActionSheetController, private camera: Camera,
    private transfer: FileTransfer, private file: File, private alertCtrl: AlertController) { }

  ngOnInit() {

    this.storage.get(ADD_OR_EDIT_NEWS).then(forAddorEditResult => {
      this.forAddOrEdit = forAddorEditResult;
      console.log('forAddOrEdit is: ' + this.forAddOrEdit);

      if (this.forAddOrEdit == 'edit') {
        this.storage.get(NEWSID_FOR_EDIT).then(newsIdResult => {
          this.newsID = newsIdResult;
          console.log('the newsID to edit is: ' + this.newsID);

          this.network.getNewsByNewsID(this.newsID).then(newsData => {
            const jsonArray = newsData;
            this.news = jsonArray[0];
            console.log('news recieved...');

            // get the image
            this.newsImage = this.network.mainNewsImagesUrl + this.news.Image;
          }).catch(err => {
            console.log(JSON.stringify(err));
            this.presentAlert('Please check your internet connection');
          });
        });
      }
    });
  }

  goBack() {
    this.router.navigate(['managenews']);
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
      this.newsImage = 'data:image/jpeg;base64,' + imageData;

      // upload selected image
      this.uploadImage(this.newsImage);
    }).catch(err => {
      console.log(JSON.stringify(err));
      this.presentAlert('Something goes wrong, please try again!!');
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
      this.newsImage = 'data:image/jpeg;base64,' + imageData;

      // upload selected image
      this.uploadImage(this.newsImage);
    }).catch(err => {
      console.log(JSON.stringify(err));
      this.presentAlert('Something goes wrong, please try again!!');
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

    fileTransfer.upload(image, this.network.mainUploadNewsImagesAPI, options).then(() => {
      this.newsImageFileName = imageFilename;
      this.presentToast('Event image has been uploaded...');
    }).catch(err => {
      console.log(JSON.stringify(err));
      this.presentAlert('Something goes wrong with Uploading image, please try again!!');
    });
  }



  // ************* Add or Edit News **************
  saveChanges(title, summary, newsBody) {
    if (summary == null) { summary = ''; }

    if ((title != '') && (title != null)) {
      if ((newsBody != '') && (newsBody != null)) {
        this.network.addOrEditNews(this.newsID, title, summary, newsBody, this.newsImageFileName, this.forAddOrEdit).then(savingResult => {
          const jsonArray = savingResult;
          if (jsonArray == 'Successful') {
            this.presentToast('Event has been saved successfully...');
            let ntfImage = this.network.mainNewsImagesUrl + this.newsImageFileName;
            this.network.sendNotification(title, summary, ntfImage, '', 'topic', 'all').then(ntfResult => {
              console.log(JSON.stringify(ntfResult));
            }).catch(errNtf => {
              console.log(JSON.stringify(errNtf));
            });
          } else {
            alert('Something goes wrong, Please try again');
          }
        }).catch(err => {
          console.log(JSON.stringify(err));
          this.presentAlert('Something goes wrong, please check your internet connection and try again!!');
        });
      } else {
        this.presentAlert('Please fill the News Message!');
      }
    } else {
      this.presentAlert('Please fill the Title!');
    }
  }

}
