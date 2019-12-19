import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AdminnewsinglechatsPage } from './adminnewsinglechats.page';

const routes: Routes = [
  {
    path: '',
    component: AdminnewsinglechatsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AdminnewsinglechatsPage]
})
export class AdminnewsinglechatsPageModule {}
