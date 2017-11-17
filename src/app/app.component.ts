import { Component, ViewChild } from '@angular/core';
import { Nav, Platform,ToastController} from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { HomePage } from '../pages/home/home';
import { DashboardPage } from '../pages/dashboard/dashboard';
import { AlmanacPage } from '../pages/almanac/almanac';
import { CoursePage } from '../pages/course/course';
import { TimetablePage } from '../pages/timetable/timetable';
import { LoginPage } from '../pages/login/login';
import { Storage } from '@ionic/storage';
import { ProfilePage } from '../pages/profile/profile';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen,public storage:Storage,public toastCtrl:ToastController) {
    this.initializeApp();

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'My Dashboard', component: DashboardPage },
      { title: 'My Almanac', component: AlmanacPage },
      { title: 'My Courses', component: CoursePage },
      { title: 'Attendance', component: TimetablePage },
      { title: 'My Profile', component: ProfilePage },
      { title:'Logout', component: LoginPage}
    ];

  }
  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    setInterval(()=>{this.checkexpiry();},1000);

  }
  checkexpiry()
  {
    this.storage.get("user").then((val)=>{
      if(val){
      if(Object.keys(val).indexOf("expiry"))
      {
      let temp = new Date(val["expiry"])
      let today = new Date();
      // console.log(temp,today);
      if(today.getTime()-temp.getTime()>=0)
      {
        this.openPage({ title:'Logout', component: LoginPage});
        // console.log("hohohoh");
        this.showToast("Login Expired");
      }
      }
      else{
        this.openPage({ title:'Logout', component: LoginPage});
        this.showToast("Login Expired");
      }
      }
    });

  }
  showToast(response_message:any)
  {
      let toast = this.toastCtrl.create({
          message: response_message,
          duration: 2200
      });
      toast.present();
  }
  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page.title=='Logout')
    {
      this.storage.set("login_stat",false);
      this.storage.set("user",null);
      this.storage.set("personal",null);
      this.storage.set("resp",null);
      this.storage.set("timetable",null);
      this.storage.set("courses",null);
    this.storage.set("caleve",null);
    }
    this.nav.setRoot(page.component);
  }
}
