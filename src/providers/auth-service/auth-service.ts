import { Injectable } from '@angular/core';
import { ViewChild } from '@angular/core';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { ToastController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import { Storage } from '@ionic/storage';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import {DashboardPage} from '../../pages/dashboard/dashboard';
/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AuthServiceProvider {
    loginurl : string;
    societynameurl : string;
    getactivememberurl : string;
    getadminmemberurl : string;
    adduserurl:string;
    base_url : string;
    stat: number;
    options : any;
    constructor(
        public http: Http,
        public storage: Storage,
        public toastCtrl: ToastController,
        ) {
        console.log('Hello AuthServiceProvider Provider');
        this.http = http;
        this.base_url = "https://iiitssmartattendance.herokuapp.com";
        this.loginurl = this.base_url+"/api/validate_user/";
        //this.checkexpiry();

    }

    logIn(user_credentials) {

    }
    getNessdata(token:any){
      return new Promise((resolve,reject)=> {


            let headers = new Headers({
                'Content-Type' : 'application/json; charset=utf-8',
                'Authorization' : 'JWT '+token
            });
            this.options = new RequestOptions({ headers: headers});
            console.log("inside",this.options)

        console.log(this.options)
                this.http.get(this.base_url+"/api/add_view_timetable/",this.options)
                .map(res=>res.json())
                .subscribe((jsonresp)=>{
                        //console.log(jsonresp,"data is empty");
                        this.storage.set("timetable",jsonresp);
                        console.log("timetable data stored");
                        this.storage.get("course").then((val) => {
                            if(val==null)
                            {
                                this.http.get(this.base_url+"/api/add_view_courses/",this.options)
                                .map(res=>res.json())
                                .subscribe((jsonresp)=>{
                                    this.storage.set("course",jsonresp);
                                    console.log("course data stored");
                                },(error)=>{
                                    console.log("Error in course data retrieval"+error);
                                    this.handleError(error);
                                });
                            }
                        });
                        this.storage.get("dept").then((val) => {
                            if(val==null)
                            {
                                this.http.get(this.base_url+"/api/departments/",this.options)
                                .map(res=>res.json())
                                .subscribe((jsonresp)=>
                                {
                                    this.storage.set("dept",jsonresp);
                                    console.log("dept data stored");
                                },(error)=>{
                                    console.log("Error in dept data retrieval"+error);
                                    this.handleError(error);
                                });
                            }
                        });

                                this.http.get(this.base_url+"/api/add_view_events/",this.options)
                                .map(res=>res.json())
                                .subscribe((jsonresp)=>
                                {
                                    this.storage.set("caleve",jsonresp);
                                    console.log("caleve data stored");
                                },(error)=>{
                                    console.log("Error in caleve data retrieval"+error);
                                    this.handleError(error);
                                });
                        resolve();
                    });
    });
  }
//// Vaishnav's function
////


showToast(response_message:any)
{
    let toast = this.toastCtrl.create({
        message: response_message,
        duration: 2200
    });
    toast.present();
}
    handleError(error: Response) {
        console.error(error);
        return Observable.throw(error || 'Server Error');
    }

}
