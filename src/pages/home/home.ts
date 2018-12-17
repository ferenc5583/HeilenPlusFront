import { Component } from '@angular/core';
import { NavController, AlertController, Platform } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';

import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { RutaPage } from '../ruta/ruta';
import { PrecontratoPage } from '../precontrato/precontrato';
import { LocalNotifications } from '@ionic-native/local-notifications';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  public online: boolean = true;
  lat: any;
  lng: any;
  locations: any;

  token = localStorage.getItem('token');

  protected map: any;

  norep: boolean = false;

  id_user: any;

  constructor(public navCtrl: NavController, public geo: Geolocation, public http: HttpClient, private auth: AuthService, private plt: Platform, public alertCtrl: AlertController, private localNoti: LocalNotifications) {

    setInterval(() => {
      this.notifierService();
    }, 2000);

    this.plt.ready().then((readySource) => {
      this.localNoti.on('click').subscribe(notification => {
        let alerts = this.alertCtrl.create({
          title: 'Socilitud de atención',
          message: 'Deseas aceptar la solicitud se servicio?',
          buttons: [
            {
              text: 'No Aceptar',
              handler: () => {
                alert("No aceptaste");
              }
            },
            {
              text: 'Aceptar',
              handler: () => {
                alert("Aceptaste");
              }
            }
          ]
        });

        alerts.present();
      })
    });

  }

  ngOnInit() {
    this.geo.getCurrentPosition().then(pos => {
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;
    }).catch(err => this.auth.showAlert("No podemos Encontrarte"));

    this.http.put(`${this.auth.url}/user/isOnline/1`, {}, { headers: { 'Content-Type': 'application/json', 'Authorization': 'bearer ' + this.token } }).subscribe();

    setInterval(() => {
      this.geo.getCurrentPosition().then(pos => {
        this.lat = pos.coords.latitude;
        this.lng = pos.coords.longitude;
        this.http.put(`${this.auth.url}/posicion/editUser/${pos.coords.latitude},${pos.coords.longitude}`, {}, { headers: { 'Content-Type': 'application/json', 'Authorization': 'bearer ' + this.token } })
          .subscribe()
      }).catch(err => this.auth.showAlert("No podemos Encontrarte"));

      let url = `${this.auth.url}/posicionProf/`;

      this.http.get(url, { headers: { 'Content-Type': 'application/json', 'Authorization': 'bearer ' + this.token } })
        .subscribe((r: any) => {
          this.locations = r;
        })
    }, 10000);
  }

  protected mapReady(map) {
    this.map = map;
  }

  public myPosition = () => {
    if (this.map)
      this.map.panTo({ lat: this.lat, lng: this.lng });
  }

  goToMatrix() {
    this.navCtrl.push(RutaPage, { id_user: this.id_user });
  }

  isOnline() {
    if (this.online != false) {
      this.http.put(`${this.auth.url}/user/isOnline/1`, {}, { headers: { 'Content-Type': 'application/json', 'Authorization': 'bearer ' + this.token } }).subscribe();
    } else {
      this.http.put(`${this.auth.url}/user/isOnline/0`, {}, { headers: { 'Content-Type': 'application/json', 'Authorization': 'bearer ' + this.token } }).subscribe();
    }

  }

  notifierService() {
    this.http.get(`${this.auth.url}/contrato/notifier/`, { headers: { 'Content-Type': 'application/json', 'Authorization': 'bearer ' + this.token } }).subscribe((res: any) => {
      if (res != null && this.norep == false) {
        this.localNoti.schedule({
          title: "Solicitud de Atención",
          text: 'Tienes una Solicitud de Atención Pendiente',
          trigger: { at: new Date(new Date().getTime() + 1000) },
        });
        this.norep = true;
        let alerts = this.alertCtrl.create({
          title: 'Tienes una solicitud de atención',
          message: 'Deseas aceptar la solicitud se servicio?',
          buttons: [
            {
              text: 'No Aceptar',
              handler: () => {
                this.norep = false;
                this.http.put(`${this.auth.url}/contrato/estados/0,0,0,1,${res.id}`, {}).subscribe((r: any) => {
                })
              }
            },
            {
              text: 'Aceptar',
              handler: () => {
                this.norep = false;
                this.navCtrl.setRoot(PrecontratoPage, {
                  id: res.id
                });
                this.http.put(`${this.auth.url}/contrato/estados/0,0,0,0,${res.id}`, {}).subscribe((r: any) => {
                })
              }
            }
          ]
        });
        alerts.present();
      } else {
        console.log("no ay nada");
      }
    });
  }
}
