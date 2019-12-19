import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NetworkEngineServiceService } from '../../services/network-engine-service.service';
import { NavController, Platform, ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { PayPal, PayPalPayment, PayPalConfiguration } from '@ionic-native/paypal/ngx';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

const TICKET_ID_TO_SHOW_DETAILS = 'ticketidtoshowdetails';
const TOKEN_KEY = 'auth-token';
const FROM_WHERE_PAYPAL = 'fromwherepaypal';

@Component({
  selector: 'app-paypalpage',
  templateUrl: './paypalpage.page.html',
  styleUrls: ['./paypalpage.page.scss'],
})
export class PaypalpagePage implements OnInit {

  ticketID = '';
  ticket: any = '';
  ticketImage = '';

  hasPaid = false;

  paymentAmount = '';
  currency = 'USD';
  currencyIcon = '$';

  paypalResult: any = '';
  transactionId = '';

  appSettings: any = '';
  dollarExchange = 0;
  fromWhere = '';

  user: any = '';
  userProfileImg = '';

  adminInfo: any = '';
  adminDeviceId = '';

  constructor(private network: NetworkEngineServiceService, public navCtrl: NavController, public plt: Platform, public storage: Storage,
    private router: Router, private payPal: PayPal, private toastCtrl: ToastController, private alertCtrl: AlertController) { }

  ngOnInit() {
    // get the ticket id to fetch its data for payment
    this.storage.get(TICKET_ID_TO_SHOW_DETAILS).then(ticketIdResult => {
      this.ticketID = ticketIdResult;
      console.log('the ticketID for payment is: ' + this.ticketID);

      // get the app settings to get dollar exchange rate
      this.network.getAppSettings().then(appDate => {
        const jsonArray2 = appDate;
        this.appSettings = jsonArray2[0];
        this.dollarExchange = this.appSettings.DirhamToDollar;
        console.log('the Dollar exchange rate: ' + this.dollarExchange);

        // fetch ticket data from server
        this.network.getTicketDetailsByTicketID(this.ticketID).then(ticketData => {
          const jsonArray = ticketData;
          this.ticket = jsonArray[0];
          console.log('the ticket data recievied...');

          this.ticketImage = this.network.mainEventImagesUrl + this.ticket.Img;

          // exchange the total price
          this.exchangeTotalPrice(this.ticket.TotalPrice, this.dollarExchange);
        }).catch(err => {
          console.log(JSON.stringify(err));
          this.presentAlert('Error in Loading', 'There was an error in your internet connection, please enter again!');
        });
      }).catch(err => {
        console.log(JSON.stringify(err));
        this.presentAlert('Error in Loading', 'There was an error in your internet connection, please enter again!');
      });
    });

    // get the user enter this page
    this.storage.get(TOKEN_KEY).then(userData => {
      this.user = userData;
      console.log('the user id came to this page: ' + this.user.UserID);
      this.userProfileImg = this.network.mainUserProfileImageUrl + this.user.ProfileImg;
    });

    // get the admin device id
    this.network.getUserByUserID('1').then(adminData => {
      const jsonArray3 = adminData;
      this.adminInfo = jsonArray3[0];
      this.adminDeviceId = this.adminInfo.DeviceID;
      console.log('the admin deviceID is : ' + this.adminDeviceId);
    }).catch(errAdmin => {
      console.log(JSON.stringify(errAdmin));
    });


    // get the root for back button
    this.storage.get(FROM_WHERE_PAYPAL).then(fromWhereResult => {
      this.fromWhere = fromWhereResult;
      console.log('from where came to this page: ' + this.fromWhere);
    });
  }

  // exchange Total price method
  exchangeTotalPrice(totalPrice, dollarExchange) {
    let totalPriceInDollar = totalPrice / dollarExchange;
    this.paymentAmount = totalPriceInDollar + '';
    this.paymentAmount = parseFloat(this.paymentAmount).toFixed(2)
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

  goBack() {
    if (this.fromWhere == 'tickets') {
      this.router.navigate(['tickets']);
    } else if (this.fromWhere == 'ticketdetails') {
      this.router.navigate(['ticketdetails']);
    } else {
      this.router.navigate(['home']);
    }
  }

  payWithPaypal() {
    console.log("Pay ????");
    this.payPal.init({
      PayPalEnvironmentProduction: 'YOUR_PRODUCTION_CLIENT_ID',
      PayPalEnvironmentSandbox: 'AQQy-u1lUAh_DIaQ6RBPEEt-6C9w0aE_8FRy2PaUb5c2NO0LktnXcuXXqsJbwUUlz20miJvQXzhPFkwI'
    }).then(() => {
      // Environments: PayPalEnvironmentNoNetwork, PayPalEnvironmentSandbox, PayPalEnvironmentProduction
      this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
        // Only needed if you get an "Internal Service Error" after PayPal login!
        //payPalShippingAddressOption: 2 // PayPalShippingAddressOptionPayPal
        merchantName: ('Aviation Gathering')
      })).then(() => {
        let paymentDescription = 'This is your payment for booking ticket in ' + this.ticket.Title;
        let payment = new PayPalPayment(this.paymentAmount, this.currency, paymentDescription, 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((res) => {

          // Successfully paid
          console.log(res);
          this.paypalResult = JSON.stringify(res);

          let transactionState = res.response.state;
          if (transactionState == 'approved') {
            this.transactionId = res.response.id;
            this.network.updateTicketPayment(this.ticketID, 1, this.transactionId).then(updatingResult => {
              this.hasPaid = true;
              this.presentToast('Your payment was successfull...');
              
              // send a notification to inform admin about this ticket payment
              let ntfMsg = this.user.Username  + ' has booked ' + this.ticket.Count + ' for ' + this.ticket.Title;
              this.network.sendNotification('Ticket Payment', ntfMsg, this.userProfileImg, this.adminDeviceId, 'single device', '').then(() => {
                console.log('a notification has been sent to admin...');
              }).catch(errNtf => {
                console.log(JSON.stringify(errNtf));
              });
              
            }).catch(err => {
              console.log(JSON.stringify(err));
              this.presentAlert('Error in Updating', 'There was an error in your internet connection, DO NOT TRY AGAIN! Check your account balance and if your account balance has been reduced, just give the transactionId to admin to check your payment.');
            });
          } else {
            this.presentAlert('Error in Payment', 'Your payment was not successful, please try again!');
          }

          // Example sandbox response
          //
          // {
          //   "client": {
          //     "environment": "sandbox",
          //     "product_name": "PayPal iOS SDK",
          //     "paypal_sdk_version": "2.16.0",
          //     "platform": "iOS"
          //   },
          //   "response_type": "payment",
          //   "response": {
          //     "id": "PAY-1AB23456CD789012EF34GHIJ",
          //     "state": "approved",
          //     "create_time": "2016-10-03T13:33:33Z",
          //     "intent": "sale"
          //   }
          // }
        }, (errRendering) => {
          // Error or render dialog closed without being successful
          console.log(JSON.stringify(errRendering));
          this.presentAlert('Error in Payment', 'There was an error in rendering the payment!');
        });
      }, (errConf) => {
        // Error in configuration
        console.log(JSON.stringify(errConf));
        this.presentAlert('Error in Payment', 'There was an error in configuring the payment!');
      });
    }, (errInit) => {
      // Error in initialization, maybe PayPal isn't supported or something else
      console.log(JSON.stringify(errInit));
      this.presentAlert('Error in Payment', 'There was an error in initializing the payment!');
    });
  }


  goToSeeCustomerTickets() {
    this.router.navigate(['tickets']);
  }

}
