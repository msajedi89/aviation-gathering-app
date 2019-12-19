import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';
import { Router } from '@angular/router';
import { AppComponent } from '../../../app/app.component';

@Component({
  selector: 'app-logout',
  templateUrl: './logout.page.html',
  styleUrls: ['./logout.page.scss'],
})
export class LogoutPage implements OnInit {

  constructor(private authService: AuthenticationService, private router: Router, public appComponent: AppComponent) { 

    this.authService.logout().then(() => {
      this.appComponent.changeSideMenutoLogout();
    this.router.navigate(['home']);
    });
    
  }

  ngOnInit() {
  }

}
