import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const ADD_OR_EDIT_NEWS = 'addoreditnews';
const NEWSID_FOR_EDIT = 'newsidforedit';

@Component({
  selector: 'app-managenews',
  templateUrl: './managenews.page.html',
  styleUrls: ['./managenews.page.scss'],
})
export class ManagenewsPage implements OnInit {

  allNews: any = '';
  newsImageURL = '';

  isLoaded = false;

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  ngOnInit() {

    this.network.getAllNews().then(newsData => {
      this.allNews = newsData;
      this.isLoaded = true;
      console.log('news recieved...');

      this.newsImageURL = this.network.mainNewsImagesUrl;
    }).catch(err => {
      console.log(JSON.stringify(err));
      this.presentAlert('Please check your internet connection');
    });
  }

  async presentAlert(text) {
    const alertCt = await this.alertCtrl.create({
      message: text
    });

    alertCt.present();
  }

  addNews() {
    this.storage.set(ADD_OR_EDIT_NEWS, 'add').then(() => {
      this.router.navigate(['addoreditnews']);
    });
  }

  editNews(newsID) {
    this.storage.set(ADD_OR_EDIT_NEWS, 'edit').then(() => {
      this.storage.set(NEWSID_FOR_EDIT, newsID).then(() => {
        this.router.navigate(['addoreditnews']);
      });
    });
  }

}
