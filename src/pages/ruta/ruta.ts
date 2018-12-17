import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';
import { CierrePage } from '../cierre/cierre';
import { HomePage } from '../home/home';


@Component({
  selector: 'page-ruta',
  templateUrl: 'ruta.html'
})
export class RutaPage {

  public lat: any;
  public lng: any;

  public origin: any;
  public destination: any;

  distance: any;
  duration: any;

  id_user: any;

  no_rep: boolean = false;

  id_cont: any;

  public markerOptions = {
    origin: {
      icon: '/assets/imgs/ico.origin.png',
    },
    destination: {
      icon: '/assets/imgs/ico.destination.png',
    },
  }

  public renderOptions = {
    suppressMarkers: true,
  }

  constructor(public navCtrl: NavController, public geo: Geolocation, public http: HttpClient, public navParams: NavParams, public auth: AuthService, public alertCtrl: AlertController) {

    this.id_user = navParams.get('id_user');

    this.id_cont = navParams.get('id_cont');

  }

  ionViewDidLoad() {
    this.geo.getCurrentPosition().then(pos => {
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;
    }).catch(err => alert("No hemos podido encontrarte, Procura activar tu GPS"));
  }

  ngOnInit() {
    setInterval(() => {
      if(this.no_rep == false){
        this.geo.getCurrentPosition().then(pos => {
          this.http.get(`${this.auth.url}/posicionUserId/${this.id_user}`).subscribe((res: any) => {
            let url = `http://router.project-osrm.org/route/v1/car/${pos.coords.longitude},${pos.coords.latitude};${res.lng},${res.lat}`;
            this.origin = { lat: pos.coords.latitude, lng: pos.coords.longitude };
            this.destination = { lat: res.lat, lng: res.lng };
            this.http.get(url)
              .subscribe((r: any) => {
                this.duration = (Math.round(r.routes[0].legs[0].duration) / 60).toFixed(1);
                this.distance = (Math.round(r.routes[0].legs[0].distance) / 1000).toFixed(1);
              })
          })
        }).catch(err => alert("No hemos podido encontrarte, Procura activar tu GPS"));

        if (this.distance == 0 && this.duration == 0) {
          this.navCtrl.setRoot(CierrePage, {
            id_cont: this.id_cont
          });
          this.no_rep = true;
        }
      }
    }, 2000)
  }

  cancell(){
    let alerts = this.alertCtrl.create({
      title: 'Seguro que deseas cancelar el servicio?',
      message: 'Se te cobrará la comisión base del Contrato',
      buttons: [
      {
        text: 'Cancelar',
        handler: () => {
          this.http.put(`${this.auth.url}/contrato/estados/1,0,0,1,${this.id_cont}`, {}).subscribe((r: any) => {
          })
          this.http.get(`${this.auth.url}/contrato/${this.id_cont}`).subscribe((res: any)=>{
            this.http.put(`${this.auth.url}/contrato/cMonto/${res.monto},${this.id_cont}`, {}).subscribe((r: any)=>{
              this.auth.showAlert("Petición Cancelada");
              this.navCtrl.setRoot(HomePage);
            })
          })
        }
      },
      {
        text: 'Volver',
        handler: () => {
        }
      }
    ]
  });

  alerts.present();
  }

}