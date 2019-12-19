import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, ToastController, ActionSheetController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File, FileEntry } from '@ionic-native/file/ngx';

const TOKEN_KEY = 'auth-token';

@Component({
  selector: 'app-editprofile',
  templateUrl: './editprofile.page.html',
  styleUrls: ['./editprofile.page.scss'],
})
export class EditprofilePage implements OnInit {

  forAddOrEdit = 'edit';

  user: any = '';
  userID = '';
  profileImage: any = '';
  profileImageFileName = '';

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private toastCtrl: ToastController, private actionSheetCtrl: ActionSheetController, private camera: Camera,
    private transfer: FileTransfer, private file: File, private alertCtrl: AlertController) { }

  ngOnInit() {

    // get the user logged in
    this.storage.get(TOKEN_KEY).then(userData => {
      this.user = userData;
      this.userID = this.user.UserID;
      console.log('the user came in: ' + this.userID);

      // get the user profile image
      if (this.user.ProfileImg != '') {
        this.profileImage = this.network.mainUserProfileImageUrl + this.user.ProfileImg;
        this.profileImageFileName = this.user.ProfileImg;
      } else {
        this.profileImage = '../../../assets/default.jpg';
        this.profileImageFileName = 'default.jpg';
      }
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
      this.profileImage = 'data:image/jpeg;base64,' + imageData;

      // upload selected image
      this.uploadImage(this.profileImage);
    }).catch(err => {
      console.log(JSON.stringify(err));
      this.presentAlert('Error', 'Something goes wrong, please try again!!');
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
      this.profileImage = 'data:image/jpeg;base64,' + imageData;

      // upload selected image
      this.uploadImage(this.profileImage);
    }).catch(err => {
      console.log(JSON.stringify(err));
      this.presentAlert('Error', 'Something goes wrong, please try again!!');
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

    fileTransfer.upload(image, this.network.mainUploadUserProfileImagesAPI, options).then(() => {
      this.profileImageFileName = imageFilename;
      this.presentToast('User Profile Image has been uploaded...');
    }).catch(err => {
      console.log(JSON.stringify(err));
      this.presentAlert('Error', 'Something goes wrong with Uploading image, please try again!!');
    });
  }


  // ************* Edit Profile Info **************
  saveChanges(name, family, mobile, email, chatName, address, pass) {
    if (mobile == null) { mobile = ''; }
    if (email == null) { email = ''; }
    if (address == null) { address = ''; }

    let username = this.user.Username;
    if ((name != '') && (family != '') && (chatName != '') && (pass != '')) {
      console.log('can proceed');
      // update user info
      this.network.updateUserInfo(this.userID, name, family, pass, address, mobile, email, this.profileImageFileName, chatName).then(updatingResult => {
        const jsonArray = updatingResult;
          if (jsonArray == 'Successful') {
            this.presentToast('Your changes have been saved successfully...');
          } else {
            this.presentAlert('Attention', 'Something goes wrong, please check your information and try again!!');
          }
      }).catch(err => {
        console.log(JSON.stringify(err));
        this.presentAlert('Error', 'Something goes wrong, please check your internet connection and try again!!');
      });
    } else {
      this.presentAlert('Attention', 'Please fill the required fields!');
    }
  }

}
