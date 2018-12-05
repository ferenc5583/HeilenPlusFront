import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NavParams, NavController } from 'ionic-angular';
import { AuthService } from '../../services/auth.service';
import { RutaPage } from '../ruta/ruta';

@Component({
    selector: 'page-precontrato',
    templateUrl: 'precontrato.html'
})

export class PrecontratoPage {

    id_contrato: any;

    id_user: any;

    fecha: any;
    hora: any;

    monto: any;

    constructor(public http: HttpClient, public navParams: NavParams, private auth: AuthService, public navCtrl: NavController) {

        this.id_contrato = navParams.get('id');

    }

    ngOnInit() {
        this.http.get(`${this.auth.url}/contrato/${this.id_contrato}`).subscribe((res: any) => {
            console.log(res);
            this.fecha = res.fecha;
            this.hora = res.hora;
            this.monto = res.monto;
            this.id_user = res.id_paciente;
        })
    }

    goToMatrix() {
        this.http.put(`${this.auth.url}/contrato/estados/1,0,0,${this.id_contrato}`, {}).subscribe((r: any) => {
            this.navCtrl.setRoot(RutaPage, {
                id_user: this.id_user
            });
        })
    }

}