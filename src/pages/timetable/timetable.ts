import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { Geolocation } from '@ionic-native/geolocation';
import { Http,Headers, RequestOptions, Response} from '@angular/http';
import { AlertController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
/**
 * Generated class for the TimetablePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-timetable',
  templateUrl: 'timetable.html',
})
export class TimetablePage {
  course_id = 1;
  course = "IR";
  secret_key : any;
  coord : any;
  flag = true;
  sub: any;
  times = 0;
  studs ={};
  inter : any;
  atten_id : any;
  stud_arr=[];
  mess : any;
  session:any;
  roll_count = 0;
  stat = "Start";
  main_url: string;
  button_status=true;
  slots=[]
  dist=""
  constructor(public alertCtrl: AlertController,public navCtrl: NavController, public navParams: NavParams,public storage: Storage,public geolocation: Geolocation,public loadingCtrl: LoadingController, public http: Http)
  {
    this.mess = "Attendance Not Started";
    this.main_url="https://iiitssmartattendance.herokuapp.com";
    this.inter = setInterval(()=>{this.check_session()},10000);
    // this.check_session();
    this.storage.get("timetable").then((time_t)=>{
      this.storage.get("courses").then((cours)=>{
      for(let i in time_t)
      {
        for(let j in cours)
        {
          if(time_t[i].Course_ID==cours[j].Course_ID)
            this.slots.push(time_t[i].T_ID)
        }
      }
    });
});
  }
  distance(lat1, lon1, lat2, lon2) {
	var radlat1 = Math.PI * lat1/180
	var radlat2 = Math.PI * lat2/180
	var theta = lon1-lon2
	var radtheta = Math.PI * theta/180
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist)
	dist = dist * 180/Math.PI
	dist = dist * 60 * 1.1515 * 1.609344 *1000;
	// if (unit=="K") { dist = dist * 1.609344 }
	// if (unit=="N") { dist = dist * 0.8684 }
	return dist
}
  ionViewDidLoad() {
    console.log('ionViewDidLoad TimetablePage');
  }
  handleError(error: Response) {
    console.error(error);
    return Observable.throw(error.json().error || 'Server Error');
}


giveAttendance(){
  console.log("hello");
  console.log(this.atten_id);
  console.log(this.secret_key,"secret");
  if(this.atten_id==this.secret_key)
  {
  this.storage.get('user').then((val)=>{
  if(this.session){
    let body ={
      Student_ID:val.Person_ID,Date_time:new Date(),Marked:"R",ASession_ID:this.session[0].Session_ID
    };
  //console.log(loc);
    let headers = new Headers({
    'Content-Type' : 'application/json',
    'Authorization': "JWT "+val.token
    });
  // loading.present();
  let options = new RequestOptions({ headers: headers});
  this.http.post(this.main_url+'/api/add_view_attendance/',body,options).subscribe((jsonr)=>
  {

    console.log("success!");
    const alert = this.alertCtrl.create({
    title: 'Successful',
    subTitle: 'You have been marked for Review',
    buttons: ['OK']
  });
  alert.present();
  this.button_status=true;
  },(err)=>{const alert = this.alertCtrl.create({
    title: "Error",
    subTitle: "Wrong Data entered",
    buttons: ['OK']
  });
  alert.present();});
}
else{
  const alert = this.alertCtrl.create({
    title: "Error",
    subTitle: "ID can't be Empty",
    buttons: ['OK']
  });
  alert.present();

}


  });
}
else{
  const alert = this.alertCtrl.create({
    title: "Error",
    subTitle: "Wrong Secret Key entered",
    buttons: ['OK']
  });
  alert.present();
}

}

check_session(){

  this.storage.get('user').then((val)=>{

  let body ={
    Student_ID:this.slots
  };
  //console.log(loc);
  let headers = new Headers({
    'Content-Type' : 'application/json',
    'Authorization': "JWT "+val.token
  });
  // loading.present();
  let options = new RequestOptions({ headers: headers});
  this.http.post(this.main_url+'/api/attendance_session/',body,options)  .map(res=>res.json())
  .subscribe((jsonr)=>
  {
    if(jsonr.length>0){
      clearInterval(this.inter);
      this.session=jsonr;
      this.sub=this.geolocation.watchPosition({enableHighAccuracy:true}).catch(this.handleError)
        .subscribe((position) => {
          console.log(position);
          console.log(jsonr);
          if(position.coords==undefined)
          {
            position={coords:{accuracy:30,latitude:89,longitude:90}};

          }
          let arr = jsonr[0].Location.split(";");
          this.secret_key=arr[2];
          this.dist =""+position.coords.latitude+";"+this.distance(position.coords.latitude,position.coords.longitude,Number(arr[1]),Number(arr[0]));
          if(this.distance(position.coords.latitude,position.coords.longitude,Number(arr[1]),Number(arr[0]))>0)
          {
              this.button_status=false;
              this.sub.unsubscribe();
              console.log("unsubscribed")
          }
        });
      }
    // console.log("success!");
    // console.log(jsonr.length);
    // for (let i in jsonr) {
    //
    //   this.storage.get("timetable").then((val)=>{
    //       console.log(val);
    //         for (let j in val){
    //           if(jsonr[i].Course_Slot==val[j].T_ID){
    //             console.log("Session Active");
    //             this.button_status=false;
    //             break;
    //           }
    //           else{
    //             this.button_status=true;
    //             console.log("Status changed!");
    //           }
    //           console.log("Timetable: ",val[j].T_ID);
    //         }
    //   });
    //         console.log(jsonr[i].Course_Slot);
    // }

  },(err)=>{console.log("Failed!");});


  });

  //clearInterval(this.inter);



}












}
