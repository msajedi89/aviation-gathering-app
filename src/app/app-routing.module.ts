import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then(m => m.HomePageModule)
  },
  {
    path: 'list',
    loadChildren: () => import('./list/list.module').then(m => m.ListPageModule)
  },
  { path: 'customerdash', loadChildren: './customer/customerdash/customerdash.module#CustomerdashPageModule' },
  { path: 'admindash', loadChildren: './admin/admindash/admindash.module#AdmindashPageModule' },
  { path: 'eventdetails', loadChildren: './pages/eventdetails/eventdetails.module#EventdetailsPageModule' },
  { path: 'allnews', loadChildren: './pages/allnews/allnews.module#AllnewsPageModule' },
  { path: 'login', loadChildren: './login/login/login.module#LoginPageModule' },
  { path: 'logout', loadChildren: './login/logout/logout.module#LogoutPageModule' },
  { path: 'signup', loadChildren: './login/signup/signup.module#SignupPageModule' },
  { path: 'manageevents', loadChildren: './pages/manageevents/manageevents.module#ManageeventsPageModule' },
  { path: 'addoreditevent', loadChildren: './pages/addoreditevent/addoreditevent.module#AddorediteventPageModule' },
  { path: 'eventsubscribers', loadChildren: './admin/eventsubscribers/eventsubscribers.module#EventsubscribersPageModule' },
  { path: 'paypalpage', loadChildren: './pages/paypalpage/paypalpage.module#PaypalpagePageModule' },
  { path: 'bookticket', loadChildren: './pages/bookticket/bookticket.module#BookticketPageModule' },
  { path: 'tickets', loadChildren: './customer/tickets/tickets.module#TicketsPageModule' },
  { path: 'ticketdetails', loadChildren: './customer/ticketdetails/ticketdetails.module#TicketdetailsPageModule' },
  { path: 'managenews', loadChildren: './admin/managenews/managenews.module#ManagenewsPageModule' },
  { path: 'addoreditnews', loadChildren: './admin/addoreditnews/addoreditnews.module#AddoreditnewsPageModule' },
  { path: 'singlechat', loadChildren: './chats/singlechat/singlechat.module#SinglechatPageModule' },
  { path: 'adminnewsinglechats', loadChildren: './chats/adminnewsinglechats/adminnewsinglechats.module#AdminnewsinglechatsPageModule' },
  { path: 'allgroupchats', loadChildren: './chats/allgroupchats/allgroupchats.module#AllgroupchatsPageModule' },
  { path: 'groupchats', loadChildren: './chats/groupchats/groupchats.module#GroupchatsPageModule' },
  { path: 'listallsubscribers', loadChildren: './chats/listallsubscribers/listallsubscribers.module#ListallsubscribersPageModule' },
  { path: 'editprofile', loadChildren: './customer/editprofile/editprofile.module#EditprofilePageModule' },
  { path: 'eventslist', loadChildren: './admin/eventslist/eventslist.module#EventslistPageModule' },
  { path: 'eventsubscriberslist', loadChildren: './admin/eventsubscriberslist/eventsubscriberslist.module#EventsubscriberslistPageModule' },
  { path: 'signupdetails', loadChildren: './login/signupdetails/signupdetails.module#SignupdetailsPageModule' },
  { path: 'newsdetails', loadChildren: './pages/newsdetails/newsdetails.module#NewsdetailsPageModule' },
  { path: 'managecustomers', loadChildren: './admin/managecustomers/managecustomers.module#ManagecustomersPageModule' },
  { path: 'customerdetails', loadChildren: './admin/customerdetails/customerdetails.module#CustomerdetailsPageModule' },
  { path: 'customerslistfortickets', loadChildren: './admin/customerslistfortickets/customerslistfortickets.module#CustomerslistforticketsPageModule' },
  { path: 'customertickets', loadChildren: './admin/customertickets/customertickets.module#CustomerticketsPageModule' }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
