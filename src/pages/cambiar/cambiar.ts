import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'page-cambiar',
  templateUrl: 'cambiar.html'
})
export class CambiarPage {

  currentPass: string;
  newPass: string;
  repetePass: string;

  token = localStorage.getItem('token');

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public http: HttpClient, private auth: AuthService) {
  }
  
  abreModal(){
    const alert = this.alertCtrl.create({
      title: 'Ayuda',
      subTitle: 'Si estas restaurando tu contraseña, ingresa en el primer campo la contraseña actual que se te ha enviado a tu Correo',
      buttons: ['Cerrar']
    });
    alert.present();
  }

  //buscar por token el username en el back
  cambiarPass(){
    this.http.get(`${this.auth.url}/user/passFind/${this.currentPass}`, { headers: { 'Content-Type': 'application/json', 'Authorization': 'bearer ' + this.token } }).subscribe((res: any) => {
      if(res.find == true){
        if(this.newPass == this.repetePass){
          this.http.put(`${this.auth.url}/user/passEdit/${this.newPass}`, {}, { headers: { 'Authorization': 'bearer ' + this.token } }).subscribe((lares: any) => {
            this.auth.showAlert(lares.message);
            this.currentPass = "";
            this.newPass = "";
            this.repetePass = "";
          });
        }else{
          this.auth.showAlert("Las contraseñas no coinciden");
        }
      }
    }, error => this.auth.showAlert("La contraseña es incorrecta"))
    
  }
  
}
