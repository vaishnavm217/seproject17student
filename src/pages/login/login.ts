import { Component,Injectable } from '@angular/core';
import {
    IonicPage,
    NavController,
    NavParams,
    LoadingController,
    ToastController,
    Events,
    AlertController} from 'ionic-angular';
import { NgForm } from '@angular/forms';
import { Storage } from '@ionic/storage';
import { DashboardPage } from '../dashboard/dashboard';
import { Http,Headers, RequestOptions, Response} from '@angular/http';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service'
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {
    login: {ph_number?: string, password?: string} = {};
    passsubmitted = false;
    usersubmitted = false;
    base_url:string;
  constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public loadingCtrl: LoadingController,
        public toastCtrl: ToastController,
        public events: Events,
        public storage: Storage,
        public http: Http,
        public alertCtrl:AlertController,
        public auth: AuthServiceProvider) {
            this.base_url = "https://iiitssmartattendance.herokuapp.com";
            this.storage.get("login_stat").then((val) => {
                console.log(val);
                if(val)
                {
                    this.storage.get("user").then((val) => {
                    this.showToast("Welcome back! "+val.first_name+" "+val.last_name);} );
                    this.navCtrl.setRoot(DashboardPage);
                }
            });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  onLogin(form: NgForm)
  {
      this.usersubmitted = true;
      this.passsubmitted = true;
      let errorr :any;
      if (form.valid)
      {
        this.usersubmitted = false;
        this.passsubmitted = false;
        let loading = this.loadingCtrl.create({
              content: "<div>Logging in</div>",
              showBackdrop: false,
          });
        loading.present();
        let body = {
            "json_data":{username:this.login.ph_number,password:this.login.password}
          };

        let headers = new Headers({
            'Content-Type' : 'application/json; charset=utf-8'
        });
        let options = new RequestOptions({ headers: headers});
        let loginurl = this.base_url+"/api/validate_user/";
        this.http.post(loginurl, body, options)
            .map(res => res.json())
            .subscribe((jsonres)=>
            {
                    console.log("Correct!");
                    console.log("val!!",jsonres)
                    console.log("Hallo");
                    if(jsonres.Role.Role_name=="Student")
                    {
                        this.auth.getNessdata(jsonres.token).catch().then(()=>{
                        this.storage.set("user",jsonres);
                        loading.dismiss();
                        console.log("WOWOW");
                        let body = {
                            'student_id': jsonres.Person_ID
                        };
                        let headers = new Headers({
                            'Content-Type' : 'application/json; charset=utf-8',
                            'Authorization' : 'JWT '+jsonres.token
                        });
                        let options = new RequestOptions({ headers: headers});
                        this.http.post(this.base_url+"/api/student_rel_courses/", body, options)
                        .map(res=>res.json())
                        .subscribe((jsonresp)=>{
                            this.storage.set("courses",jsonresp);
                            console.log("courses",jsonresp);
                        });
                        loading.setContent("Success!");
                        this.showToast("Welcome "+jsonres.first_name+" "+jsonres.last_name);
                        this.storage.set("login_stat",true);
                        this.navCtrl.setRoot(DashboardPage);
                        });
                    }
                    else
                    {
                        loading.dismiss();
                        const alert = this.alertCtrl.create({
                            title: 'Unauthorized Login',
                            subTitle: 'Please login using Faculty app',
                            buttons: ['Dismiss']
                          });
                          alert.present();
                    }



            },(error)=>
            {
                console.log(Object.keys(error));
                console.log("Error in logging in!",error);
                if(Object.keys(error).indexOf("status")!=-1 && error.status.toString()=="404")
                {
                    console.log("Went");
                    loading.dismiss();
                    const alert = this.alertCtrl.create({
                        title: 'Login Failed',
                        subTitle: 'Wrong Credentials',
                        buttons: ['Dismiss']
                      });
                      alert.present();
                }
                //  this.handleError(error);

            });
    }
      else {
          if(this.login.ph_number)
          {
            this.usersubmitted = false;
          }
          if(this.login.password)
          {
            this.passsubmitted = false;
          }
      }
  }
  showToast(response_message:any)
    {
        let toast = this.toastCtrl.create({
            message: response_message,
            duration: 2200
        });
        toast.present();
    }

}
