import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AddoreditnewsPage } from './addoreditnews.page';

const routes: Routes = [
  {
    path: '',
    component: AddoreditnewsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AddoreditnewsPage]
})
export class AddoreditnewsPageModule {}
