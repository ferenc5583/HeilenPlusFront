import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavParams, NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { RutaPage } from '../ruta/ruta';
import { Geolocation } from '@ionic-native/geolocation';
import { TerminosPage } from '../terminos/terminos';
import { HomePage } from '../home/home';

@Component({
    selector: 'page-precontrato',
    templateUrl: 'precontrato.html'
})

export class PrecontratoPage {

    id_contrato: any;

    fecha: any;
    hora: any;

    monto: any;
    especialidad: any;

    public id_user: any;

    lat_user: any;
    lng_user: any;

    distance: any;

    token = localStorage.getItem('token');

    constructor(public http: HttpClient, public navParams: NavParams, private auth: AuthService, public navCtrl: NavController, public geo: Geolocation) {

        this.id_contrato = navParams.get('id');

    }

    ngOnInit() {
        this.http.get(`${this.auth.url}/contrato/${this.id_contrato}`).subscribe((res: any) => {
            this.fecha = res.fecha;
            this.hora = res.hora;
            this.monto = res.monto;
            this.id_user = res.id_paciente;

            this.http.get(`${this.auth.url}/posicionUserId/${this.id_user}`).subscribe((resp: any) => {
                this.geo.getCurrentPosition().then(pos => {
                    let url = `http://router.project-osrm.org/route/v1/car/${pos.coords.longitude},${pos.coords.latitude};${resp.lng},${resp.lat}`;
                    this.http.get(url)
                        .subscribe((r: any) => {
                            this.distance = (Math.round(r.routes[0].legs[0].distance) / 1000).toFixed(1);
                        })
                }).catch(err => alert("No hemos podido encontrarte, Procura activar tu GPS"));
            })

            this.http.get(`${this.auth.url}/user/${res.id_profesional}`).subscribe((respu: any) => {
                this.especialidad = respu.id_especialidad.nombre.toUpperCase();
            })
        })
    }

    goToMatrix() {
        this.http.put(`${this.auth.url}/contrato/estados/1,0,0,0,${this.id_contrato}`, {}).subscribe((r: any) => {
            this.navCtrl.setRoot(RutaPage, {
                id_user: this.id_user,
                id_cont: this.id_contrato
            });
            this.http.put(`${this.auth.url}/user/isOnline/0`, {}, { headers: { 'Content-Type': 'application/json', 'Authorization': 'bearer ' + this.token } }).subscribe();
        })
    }

    goToTerminos() {
        this.navCtrl.push(TerminosPage);
    }

    cancell() {
        this.http.put(`${this.auth.url}/contrato/estados/0,0,0,1,${this.id_contrato}`, {}).subscribe((r: any) => {
            this.navCtrl.setRoot(HomePage);
            this.auth.showAlert("Has rechazado la Solicitud");
        })
    }

}