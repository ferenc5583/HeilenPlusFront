import { Component } from '@angular/core';
import { NavParams, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'page-detalle',
    templateUrl: 'detalle.html'
})

export class DetallePage {

    before: boolean = false;

    public id_cont: any;

    fecha: any;
    hora: any;
    monto: any;
    calificada: boolean;
    terminada: boolean;
    cancelada: boolean;

    nombre_pas: any;
    apellido_pas: any;
    rut_pas: any;



    constructor(public navParams: NavParams, public http: HttpClient, private auth: AuthService, public alertCtrl: AlertController) {

        this.id_cont = navParams.get('id_cont');

    }

    ngOnInit() {
        this.http.get(`${this.auth.url}/contrato/${this.id_cont}`).subscribe((res: any) => {
            this.fecha = res.fecha;
            this.hora = res.hora;
            this.monto = res.monto;
            this.calificada = res.calificada;
            this.terminada = res.terminada;
            this.cancelada = res.cancelada;

            this.http.get(`${this.auth.url}/user/${res.id_paciente}`).subscribe((res: any) => {
                this.nombre_pas = res.firstname.toUpperCase();
                this.apellido_pas = res.lastname.toUpperCase();
                this.rut_pas = res.rut.toUpperCase();
            })
        })
    }

}