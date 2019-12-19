import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const NEWS_ID_TO_SHOW_DETAILS = 'newsidfordetails';
const FROM_WHERE_FOR_NEWS = 'fromwherefornews';

@Component({
  selector: 'app-allnews',
  templateUrl: './allnews.page.html',
  styleUrls: ['./allnews.page.scss'],
})
export class AllnewsPage implements OnInit {

  allNews: any = '';
  newsImageURL = '';

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private alertCtrl: AlertController) { }

  ngOnInit() {

    this.newsImageURL = this.network.mainNewsImagesUrl;

    // get all news
    this.network.getAllNews().then(newsData => {
      this.allNews = newsData;
    }).catch(err => {
      console.log(JSON.stringify(err));
      this.presentAlert('Attention', 'Please check your internet connection!!');
    });
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

  showNewsDetails(newsID) {
    this.storage.set(FROM_WHERE_FOR_NEWS, 'allnews').then(() => {
      this.storage.set(NEWS_ID_TO_SHOW_DETAILS, newsID).then(() => {
        this.router.navigate(['newsdetails']);
      });
    });
  }

}
