import { Component,Input} from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { File } from '@ionic-native/file';
import { Storage } from '@ionic/storage';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { DatePipe } from '@angular/common';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NgForm } from '@angular/forms';
/**
 * Generated class for the CoursedetailPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-coursedetail',
  templateUrl: 'coursedetail.html',
})

export class CoursedetailPage {

  course_id : any;
  course_details = {};
  course : any;
  students= [];
  assignm =[]
  options: any;
  login: {file?: string}={};
  @Input() accept = 'image/*';
  constructor(public navCtrl: NavController, public navParams: NavParams,public alertCtrl: AlertController,public storage: Storage, public http:Http,public iab:InAppBrowser,public file: File,public filetransfer:FileTransfer) 
  {

  this.course="Structure";
  this.course_id=this.navParams.get("id");
  console.log(this.course_id);
  this.storage.get("user").then((user)=>{
    let headers = new Headers({
      'Content-Type' : 'application/json; charset=utf-8',
      'Authorization': 'JWT '+user.token
    });
    this.options = new RequestOptions({headers:headers})
  this.storage.get("courses").then((val)=>{
    
    let temp ={};
    console.log();
    for(let i=0;val[i]!=undefined;i++){
    if(val[i].Course_ID==this.course_id)
    {
      temp["Name"]=val[i].Course_Name;
      temp["desp"]=val[i].Course_description;
    }
  }
  this.course_details=temp;
  console.log("details",this.course_details);
  });
  this.http.get("https://iiitssmartattendance.herokuapp.com/api/add_view_assignments/",this.options)
  .map(res=>res.json())
  .subscribe((res)=>{
    for(let i of res)
    {
      if(i.Course_ID==this.course_id)
      {
      let temp=i;
      temp.End_Time = new Date(temp.End_Time);
      temp.Start_Time = new Date(temp.Start_Time);
      this.assignm.push(temp);
    }
    }
    console.log("assignment",this.assignm)
  });
  console.log("yey",this.course_id);
let body={
  course_id:this.course_id
};

  this.http.post("https://iiitssmartattendance.herokuapp.com/api/courses_rel_students/",body,this.options)
  .map(res=>res.json())
  .subscribe((res)=>{
    for(let i of Object.keys(res))
    {
      this.students.push({"Name":res[i].First_Name+" "+res[i].Last_Name,"Num":i});
    }
    console.log("lol",this.students);
  });
});
}




  ionViewDidLoad() {
    console.log('ionViewDidLoad CoursedetailPage');
  }
  func(form:NgForm){
    console.log(form);
    console.log(this.login);
    let temp = this.alertCtrl.create({
      title:this.login.file,
    });
    temp.present();
    let body={
      crap:this.login.file
    };
    console.log(this.options)
    this.http.post("https://iiitssmartattendance.herokuapp.com/api/temp/",body,this.options)
    .map(res=>res.json())
    .subscribe((res)=>{console.log("sent");});
  }
  openlink(url){
    this.iab.create(url,'_system');
    // console.log(this.file.applicationDirectory);
    // const alert = this.alertCtrl.create({
    //   title: 'Dir',
    //   subTitle: this.file.externalDataDirectory,
    //   buttons: ['ok']
    // });
    // alert.present();
    // const options: DocumentViewerOptions = {
    //   title: 'My PDF'
    // };
    // this.fileopener.viewDocument("assets/file/file.pdf",'application/pdf',options);
    // this.fileopener.open(this.file.+"/assets/file/file.pdf",'application/pdf')
//     const options: DocumentViewerOptions = {
//       title: 'My PDF'
//     };
// this.document.viewDocument('../../assets/file/file.pdf', , options);
  }
  presentPrompt() {
    const alert = this.alertCtrl.create({
      title: 'File Upload',
      inputs: [
        {
          name: 'File',
          placeholder: 'File to upload',
          type: 'file'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'OK',
          handler: data => {
            let lol=this.alertCtrl.create({
              title:data.File
            });
            lol.present();
            console.log(data);
          }
        }
      ]
    });
    alert.present();
  }
  

}
// @Component({
//   template:`<input type="file" accept="*/*" id="upload" />`
// }
// )
// class Profile {

//  constructor(params: NavParams) {
//    console.log('UserId', params.get('userId'));
//  }
// }
