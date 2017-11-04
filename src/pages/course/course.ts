import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { CoursedetailPage } from '../coursedetail/coursedetail';
/**
 * Generated class for the CoursePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-course',
  templateUrl: 'course.html',
})
/* JS (Typescripting) starts here */
export class CoursePage {
  courses: any;
  constructor(public navCtrl: NavController, public navParams: NavParams,public storage: Storage) {
    this.storage.get("courses").then((val)=>{
      let temp =[];
      console.log("val.keys",Object.keys(val));
      for(let i=0;val[i]!=undefined;i++){
      temp.push({"Name":val[i].Course_Name,"id":val[i].Course_ID});
      console.log(i);
    }
    this.courses = temp;
    console.log(temp);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CoursePage');
  }
  OpenCourse(page,id){
    this.navCtrl.push(page,{"id":id});
  }

}
