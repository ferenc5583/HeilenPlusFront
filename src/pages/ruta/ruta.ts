import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { AuthService } from '../../services/auth.service';
import { HttpClient } from '@angular/common/http';


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

  constructor(public navCtrl: NavController, public geo: Geolocation, public http: HttpClient, public navParams: NavParams, public auth: AuthService) {

    this.id_user = navParams.get('id_user');

    setInterval(() => {
      this.ngOnInit();
    }, 2000);

  }

  ionViewDidLoad() {
    this.geo.getCurrentPosition().then(pos => {
      this.lat = pos.coords.latitude;
      this.lng = pos.coords.longitude;
    }).catch(err => alert("No hemos podido encontrarte, Procura activar tu GPS"));
  }

  ngOnInit() {
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
  }

}