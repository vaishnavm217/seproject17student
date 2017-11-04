import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the ProfilePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */
//profilepage
@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
username : any;
email: any;
id: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public storage: Storage) {
      this.storage.get("user").then((user)=>{
        console.log(user);
        this.username = user.first_name+" "+user.last_name;
        this.email=user.email;
        this.id=user.username;

      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProfilePage');
  }

}
