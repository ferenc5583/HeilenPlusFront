import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';

import 'rxjs/add/operator/map';
import { ToastController } from 'ionic-angular';

@Injectable()
export class AuthService {
   userName: string;
   loggedIn: boolean;
   url = 'http://192.168.0.106:8081';
   //url para sever en lan: http://192.168.0.106:8081
   //url para sever solo en equipo: http://localhost:8081
   //url dominio de amazon: 

   constructor(private http: Http, public toastCtrl: ToastController) {
      this.userName = '';
      this.loggedIn = false;
   }
   
   login(userInfo) {
      let url = `${this.url}/auth`;
      let iJon = JSON.stringify(userInfo);

      return this.http.post(url, iJon, {
         headers: new Headers({
            'Content-Type':'application/json'
         })
      })
      .map(res => res.json())
      .map(res => {
         if (res=="error" || res=="nofound"){
            this.loggedIn = false;
         } else {
            localStorage.setItem('token', res.token);
            this.userName = userInfo.user;
            this.loggedIn = true;
         }
         return this.loggedIn;
      });
   }

   logout(): void {
      localStorage.removeItem('token');
      this.userName = '';
      this.loggedIn = false;
   }

   isLoggedIn() {
      return this.loggedIn;
   }

   showAlert(message: string) {
      const toast = this.toastCtrl.create({
        message: message,
        duration: 3000
      });
      toast.present();
    }
}