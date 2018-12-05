import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { RegistrarsePage } from '../registrarse/registrarse';
import { AuthService } from '../../services/auth.service';
import { HomePage } from '../home/home';
import { RestaurarContrasenaPage } from '../restaurar-contrasena/restaurar-contrasena';
import { HttpClient } from '@angular/common/http';
import { RutaPage } from '../ruta/ruta';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Geolocation } from '@ionic-native/geolocation';

@Component({
  selector: 'page-inicio-sesion',
  templateUrl: 'inicio-sesion.html'
})

export class InicioSesionPage {

  username: string;
  password: string;
  isLogged: boolean;

  constructor(
    public navCtrl: NavController,
    public http: HttpClient,
    private auth: AuthService,
    private openNativeSettings: OpenNativeSettings,
    public geo: Geolocation) {
  }

  Signup() {
    //login solo para pacientes, cambiar numero de rol para otros roles
    let f = { username: this.username, password: this.password };
    this.http.get(`${this.auth.url}/user/byRole/${this.username},3`).subscribe(res => {
      this.auth.login(f)
        .subscribe(
          rs => this.isLogged = rs,
          er => this.auth.showAlert("Credenciales incorrectas o inexistentes"),
          () => {
            if (this.isLogged == true) {
              this.navCtrl.setRoot(HomePage)
                .then(data => console.log(data),
                  error => alert(error));
            } else {
              console.log("Acceso Denegado");
            }
          }
        )
    }, error => this.auth.showAlert("Credenciales incorrectas o inexistentes"))
  }

  goToRegister(params) {
    if (!params) params = {};
    this.navCtrl.push(RegistrarsePage);
  }

  passForgot() {
    this.navCtrl.push(RestaurarContrasenaPage);
  }

  ngOnInit() {
    this.subscribeCurrentPosition()
    if (localStorage.getItem('token') != null && navigator.onLine == true) {
      this.navCtrl.setRoot(HomePage);
    }
  }

  subscribeCurrentPosition() {
    setInterval(() => {
      this.geo.getCurrentPosition().then(pos => {
        console.log(pos.coords.latitude);
        console.log(pos.coords.longitude);
      }).catch(err => {
        this.auth.showAlert("GPS Desconectado");
      });
    }, 2000);
  }



  goToMatrix() {
    this.navCtrl.push(RutaPage);
  }

  openUbication() {
    this.openNativeSettings.open("location").then(val => {

    }).catch(err => {
      alert(JSON.stringify(err));
    })
  }

}
