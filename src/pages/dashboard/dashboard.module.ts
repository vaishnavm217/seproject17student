import { NgModule } from '@angular/core';  //importing NgModule
import { IonicPageModule } from 'ionic-angular'; //importing IonicPageModule
import { DashboardPage } from './dashboard'; //importing DashboardPage

@NgModule({
  declarations: [
    DashboardPage,
  ],
  imports: [
    IonicPageModule.forChild(DashboardPage),
  ],
})
export class DashboardPageModule {}
