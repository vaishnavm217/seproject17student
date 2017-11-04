import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the AlmanacPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-almanac',
  templateUrl: 'almanac.html',
})
export class AlmanacPage {

type: string = "month";
  data:any = {};
  eventSource=[];
  viewTitle: string;
  selectedDay= new Date();
  calendar={
	  mode:'month',
	  currentDate: this.selectedDay
  };
  course_dict={};
  time_table_eve=[];
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,public storage: Storage) {
    this.storage.get("timetable").then((val)=>{
      console.log("timetable",val);
        this.storage.get("courses").then((val1)=>{
            for(let i of val)
            {
                for(let j=0;j<Object.keys(val1).length;j++){
                  console.log("iteration",i,val1[j])
                if(i.Course_ID==val1[j].Course_ID)
                {
                i["Course_Name"] = val1[j].Course_Name;
                this.time_table_eve.push(i)
                }
                //console.log(val);
            }
            }
            console.log(this.time_table_eve);
            this.eventSource= this.createRandomEvents();
        });
        
    });
  
  }
  addEvent(){

	  //let modal = this.modalCtrl.create(AddappointmentPage);
    //modal.present();

  }



  createRandomEvents() {

          var events = [];
          var startDate=new Date("1 August 2017 00:00:00");
          var Enddate=new Date("11 December 2017 00:00:00");
          for (var i = startDate; i <=Enddate; i.setDate(i.getDate()+1)) {
                    for(var j=0;j<this.time_table_eve.length;j++)
                    {
                    if(i.getDay()==(this.time_table_eve[j].T_days+8)%7)
                    {console.log(i);
                    var temp = this.time_table_eve[j].Start_time.split(":");
                    var temp1 = this.time_table_eve[j].End_time.split(":");
                  var startTime = new Date(i.getFullYear(), i.getMonth(), i.getDate() ,temp[0],temp[1],temp[2]);
                  var endTime = new Date(i.getFullYear(), i.getMonth(), i.getDate() ,temp1[0],temp1[1],temp1[2]);
                  events.push({
                      title: this.time_table_eve[j].Course_Name+" - "+this.time_table_eve[j].Class_ID,
                      startTime: startTime,
                      endTime: endTime,
                      allDay: false
                  });
                }
                }
          }

          return events;
      }

      modechange(type){
      	 console.log('mode changed!');
      	 if(type == 'month'){
      			this.calendar.mode='month';
      			console.log('mode changed! month');
      	 }
      	 else if (type == 'week'){
      		    this.calendar.mode='week';
      			console.log('mode changed! week');
      	 }
      	 else if (type == 'day'){
      		    this.calendar.mode='day';
      			console.log('mode changed! day');
      	 }
       }
       onViewTitleChanged(title){
  this.viewTitle=title;
}
onTimeSelected(ev){
  console.log('Selected time: ' + ev.selectedTime.getUTCFullYear() + ', hasEvents: ' +
          (ev.events !== undefined && ev.events.length !== 0) + ', disabled: ' + ev.disabled);


}
onEventSelected(event){
  let alert = this.alertCtrl.create({
    title: '' + event.title,
    subTitle: event.startTime,
    buttons: ['OK']
  });

  alert.present();


}





  ionViewDidLoad() {
    console.log('ionViewDidLoad AlmanacPage');
  }

}
