import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

const FROM_WHERE_FOR_NEWS = 'fromwherefornews';
const NEWS_ID_TO_SHOW_DETAILS = 'newsidfordetails';

@Component({
  selector: 'app-newsdetails',
  templateUrl: './newsdetails.page.html',
  styleUrls: ['./newsdetails.page.scss'],
})
export class NewsdetailsPage implements OnInit {

  newsID = '';
  news: any = '';
  newsImageURL = '';

  isLoaded = false;
  fromWhere = '';

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private alertCtrl: AlertController) { }

  ngOnInit() {

    this.storage.get(NEWS_ID_TO_SHOW_DETAILS).then(newsIdResult => {
      this.newsID = newsIdResult;
      console.log('the newsID to show its details: ' + this.newsID);

      this.network.getNewsByNewsID(this.newsID).then(newsData => {
        const jsonArray = newsData;
        this.news = jsonArray[0];
        this.isLoaded = true;
        console.log('the news recieved...');

        // prepare news image
        this.newsImageURL = this.network.mainNewsImagesUrl + this.news.Image;
      }).catch(err => {
        console.log(JSON.stringify(err));
        this.presentAlert('Attention', 'Please check your internet connection!!');
      });
    });

    this.storage.get(FROM_WHERE_FOR_NEWS).then(fromWhereResult => {
      this.fromWhere = fromWhereResult;
      console.log('the fromWhere: ' + this.fromWhere);
    });
  }

  goBack() {
    if (this.fromWhere == 'home') {
      this.router.navigate(['home']);
    } else {
      this.router.navigate(['allnews']);
    }
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

}
