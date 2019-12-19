import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NetworkEngineServiceService {

  // Remote Server
  mainUrl = "https://aviationgathering.ae/mobile/apis/";
  mainEventImagesUrl = "https://aviationgathering.ae/mobile/images/eventimages/";
  mainNewsImagesUrl = "https://aviationgathering.ae/mobile/images/newsimage/";
  mainUserProfileImageUrl = "https://aviationgathering.ae/mobile/images/profileimages/";

  mainUploadEventImagesAPI = "https://aviationgathering.ae/mobile/apis/uploadEventPhoto.php";
  mainUploadNewsImagesAPI = "https://aviationgathering.ae/mobile/apis/uploadNewsPhoto.php";
  mainUploadUserProfileImagesAPI = "https://aviationgathering.ae/mobile/apis/uploadUserProfileImage.php";

  // Local Server
  /*mainUrl = "http://localhost:88/aviation/apis/";

  mainEventImagesUrl = "http://localhost:88/aviation/images/eventimages/";
  mainNewsImagesUrl = "http://localhost:88/aviation/images/newsimage/";
  mainUserProfileImageUrl = "http://localhost:88/aviation/images/profileimages/";

  mainUploadEventImagesAPI = "http://localhost:88/aviation/apis/uploadEventPhoto.php";
  mainUploadNewsImagesAPI = "http://localhost:88/aviation/apis/uploadNewsPhoto.php";*/

  constructor(public http: HttpClient) { }

  // get Open Ticket Events
  getActiveEventsForHomePage(): Promise<any> {
    let url = this.mainUrl + 'getActiveEventsForHomePage.php';

    let request = this.http.get(url);

    return request.toPromise();
  }

  // get all events
  getAllEvents(): Promise<any> {
    let url = this.mainUrl + 'getAllEvents.php';

    let request = this.http.get(url);

    return request.toPromise();
  }

  // get 7 Latest News
  get7LatestNews(): Promise<any> {
    let url = this.mainUrl + 'get7LatestNews.php';

    let request = this.http.get(url);

    return request.toPromise();
  }

  // get Event by EventID
  getEventByEventID(eventID): Promise<any> {
    const url = this.mainUrl + "getEventByEventID.php";

    const param = {
      eventID: eventID
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // get all News
  getAllNews(): Promise<any> {
    let url = this.mainUrl + 'getAllNews.php';
    // let url = 'https://aviationgathering.ae/getAllNews.php';

    let request = this.http.get(url);

    return request.toPromise();
  }

  // get User By Username
  getUserByUsername(username): Promise<any> {
    const url = this.mainUrl + "getUserByUsername.php";

    const param = {
      username: username
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // add or edit user
  addOrEditUser(userID, name, family, username, pass, address, mobile, profileImg, email, chatName, userType, status, addOrEdit, deviceId): Promise<any> {
    const url = this.mainUrl + "addOrEditUser.php";

    const param = {
      userID: userID, name: name, family: family, username: username, pass: pass, address: address, mobile: mobile, 
      profileImg: profileImg, email: email, chatName: chatName, userType: userType, status: status, addOrEdit: addOrEdit, deviceId: deviceId
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // get all events for Managing
  getAllEventsForManaging(): Promise<any> {
    let url = this.mainUrl + 'getAllEventsForManaging.php';

    let request = this.http.get(url);

    return request.toPromise();
  }

  // update Event Status
  updateEventStatus(eventID, status): Promise<any> {
    const url = this.mainUrl + "updateEventStatus.php";

    const param = {
      eventID: eventID, status: status
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // add or edit Event
  addOrEditEvent(eventID, title, summary, description, vipGuests, startDate, endDate, normalSeats, isRanked, normalPrice, vipSeats, vipPrice, image, openTicket, location, addOrEdit): Promise<any> {
    const url = this.mainUrl + "addOrEditEvent.php";

    const param = {
      eventID: eventID, title: title, summary: summary, description: description, vipGuests: vipGuests, startDate: startDate, endDate: endDate, 
      normalSeats: normalSeats, isRanked: isRanked, normalPrice: normalPrice, vipSeats: vipSeats, vipPrice: vipPrice, image: image, openTicket: openTicket, location: location, addOrEdit: addOrEdit
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // get Active Event Subscribers
  getActiveEventSubscribers(eventID): Promise<any> {
    const url = this.mainUrl + "getActiveEventSubscribers.php";

    const param = {
      eventID: eventID
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // add Ticket
  addTicket(eventID, customerID, ticketType, ticketCount, totalPrice, seatsLeft): Promise<any> {
    const url = this.mainUrl + "addTicket.php";

    const param = {
      eventID: eventID, customerID: customerID, ticketType: ticketType, ticketCount: ticketCount, totalPrice: totalPrice, seatsLeft: seatsLeft
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // get Customer Tickets By UserID
  getCustomerTicketsByUserID(userID): Promise<any> {
    const url = this.mainUrl + "getCustomerTicketsByUserID.php";

    const param = {
      userID: userID
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // get Ticket Details By TicketID
  getTicketDetailsByTicketID(ticketID): Promise<any> {
    const url = this.mainUrl + "getTicketDetailsByTicketID.php";

    const param = {
      ticketID: ticketID
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // get News By NewsID
  getNewsByNewsID(newsID): Promise<any> {
    const url = this.mainUrl + "getNewsByNewsID.php";

    const param = {
      newsID: newsID
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // add Or Edit News
  addOrEditNews(newsID, title, summary, news, image, addOrEdit): Promise<any> {
    const url = this.mainUrl + "addOrEditNews.php";

    const param = {
      newsID: newsID, title: title, summary: summary, news: news, image: image, addOrEdit: addOrEdit
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // check User Has New Msg
  checkUserHasNewMsg(userID): Promise<any> {
    const url = this.mainUrl + "checkUserHasNewMsg.php";

    const param = {
      userID: userID
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // get Customer Chat By UserID
  getCustomerChatByUserID(userID, adminID, whoIs): Promise<any> {
    const url = this.mainUrl + "getCustomerChatByUserID.php";

    const param = {
      userID: userID, adminID: adminID, whoIs: whoIs
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // add New Single Chat Msg
  addNewSingleChatMsg(userChat, userSend, userGet, message): Promise<any> {
    const url = this.mainUrl + "addNewSingleChatMsg.php";

    const param = {
      userChat: userChat, userSend: userSend, userGet: userGet, message: message
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // get New Customer Chat Msgs For Admin
  getNewCustomerChatMsgsForAdmin(userGetID): Promise<any> {
    const url = this.mainUrl + "getNewCustomerChatMsgsForAdmin.php";

    const param = {
      userGetID: userGetID
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // get Tickets Based On EventID and CustomerID
  getTicketsBasedOnEventIDandCustomerID(eventID, userID): Promise<any> {
    const url = this.mainUrl + "getTicketsBasedOnEventIDandCustomerID.php";

    const param = {
      eventID: eventID, userID: userID
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // get Event Chat Msgs
  getEventChatMsgs(eventID, adminID, whoIs): Promise<any> {
    const url = this.mainUrl + "getEventChatMsgs.php";

    const param = {
      eventID: eventID, adminID: adminID, whoIs: whoIs
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // add New Group Chat Msg
  addNewGroupChatMsg(eventID, userID, message, whoIs): Promise<any> {
    const url = this.mainUrl + "addNewGroupChatMsg.php";

    const param = {
      eventID: eventID, userID: userID, message: message, whoIs: whoIs
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // get All Active Customers
  getAllActiveCustomers(): Promise<any> {
    let url = this.mainUrl + 'getAllActiveCustomers.php';

    let request = this.http.get(url);

    return request.toPromise();
  }

  // sendNotification
  sendNotification(title, message, image_url, device_token, send_to, topic): Promise<any> {
    const url = this.mainUrl + "sendNotification.php";

    const param = {
      send_to: send_to, title: title, message: message, image_url: image_url, device_token: device_token, topic: topic
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // update Admin DeviceID
  updateAdminDeviceID(userID, deviceID): Promise<any> {
    const url = this.mainUrl + "updateAdminDeviceID.php";

    const param = {
      userID: userID, deviceID: deviceID
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // get User By UserID
  getUserByUserID(userID): Promise<any> {
    const url = this.mainUrl + "getUserByUserID.php";

    const param = {
      userID: userID
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // get App Settings
  getAppSettings(): Promise<any> {
    let url = this.mainUrl + 'getAppSettings.php';

    let request = this.http.get(url);

    return request.toPromise();
  }

  // update Ticket Payment
  updateTicketPayment(ticketID, payment, transactionID): Promise<any> {
    const url = this.mainUrl + "updateTicketPayment.php";

    const param = {
      ticketID: ticketID, payment: payment, transactionID: transactionID
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // update User Info
  updateUserInfo(userID, name, family, pass, address, mobile, email, profileImg, chatName): Promise<any> {
    const url = this.mainUrl + "updateUserInfo.php";

    const param = {
      userID: userID, name: name, family: family, pass: pass, address: address, mobile: mobile, email: email, 
      profileImg: profileImg, chatName: chatName
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // generate PDF
  generatePDF(eventID, event): Promise<any> {
    const url = this.mainUrl + "generatePDF.php";

    const param = {
      eventID: eventID, event: event
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // get All Customers For Managing
  getAllCustomersForManaging(): Promise<any> {
    let url = this.mainUrl + 'getAllCustomersForManaging.php';

    let request = this.http.get(url);

    return request.toPromise();
  }

  // update User Status
  updateUserStatus(userID, status): Promise<any> {
    const url = this.mainUrl + "updateUserStatus.php";

    const param = {
      userID: userID, status: status
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // filter Customer By Family
  filterCustomerByFamily(mySearch): Promise<any> {
    const url = this.mainUrl + "filterCustomerByFamily.php";

    const param = {
      mySearch: mySearch
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

  // get Customer Tickets
  getCustomerTickets(userID): Promise<any> {
    const url = this.mainUrl + "getCustomerTickets.php";

    const param = {
      userID: userID
    };

    let request = this.http.post(url, param);

    return request.toPromise();
  }

}
