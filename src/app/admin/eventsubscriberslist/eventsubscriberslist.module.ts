import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { EventsubscriberslistPage } from './eventsubscriberslist.page';

const routes: Routes = [
  {
    path: '',
    component: EventsubscriberslistPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [EventsubscriberslistPage]
})
export class EventsubscriberslistPageModule {}
