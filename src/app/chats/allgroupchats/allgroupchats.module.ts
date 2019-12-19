import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { AllgroupchatsPage } from './allgroupchats.page';

const routes: Routes = [
  {
    path: '',
    component: AllgroupchatsPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AllgroupchatsPage]
})
export class AllgroupchatsPageModule {}
