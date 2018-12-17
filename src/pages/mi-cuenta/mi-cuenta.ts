import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/first';
import 'rxjs/add/operator/map';
import { AuthService } from '../../services/auth.service';
import { InicioSesionPage } from '../inicio-sesion/inicio-sesion';
import { CambiarPage } from '../cambiar/cambiar';


@Component({
  selector: 'page-mi-cuenta',
  templateUrl: 'mi-cuenta.html'
})
export class MiCuentaPage {

  nombre: string;
  apellido: string;
  email: string;
  calificacion: string;
  especialidad: string;
  rut: string;
  estado: boolean;
  especialidades: any;

  token = localStorage.getItem('token');

  constructor(
    public navCtrl: NavController,
    private auth: AuthService,
    public http: HttpClient) {
  }

  logOut() {
    this.auth.logout();
    this.navCtrl.setRoot(InicioSesionPage);
    this.http.put(`${this.auth.url}/user/isOnline/0`, {}, { headers: { 'Content-Type': 'application/json', 'Authorization': 'bearer ' + this.token } }).subscribe();
  }

  ngOnInit() {
    let url = `${this.auth.url}/user/`;
    this.http.get(url, { headers: { 'Content-Type': 'application/json', 'Authorization': 'bearer ' + this.token } })
      .subscribe((res: any) => {
        this.email = res.username;
        this.nombre = res.firstname.toUpperCase();
        this.apellido = res.lastname.toUpperCase();
        this.calificacion = res.id_calificacion.pun_final.toFixed(2);
        this.especialidad = res.id_especialidad.id;
        this.rut = res.rut.toUpperCase();
        this.estado = res.online;
      });

    this.http.get(`${this.auth.url}/especialidad/`).subscribe((res: any) => {
      this.especialidades = res;
    })
  }

  passChange() {
    this.navCtrl.push(CambiarPage);
  }

  doRefresh(refresher) {
    //durante la carga
    this.ngOnInit();

    setTimeout(() => {
      //despues de cargar
      refresher.complete();
    }, 500);
  }

  onChange(C) {
    this.http.put(`${this.auth.url}/user/especiEdit/${C}`, {}, { headers: { 'Content-Type': 'application/json', 'Authorization': 'bearer ' + this.token } }).subscribe((res: any) => {
      console.log(res);
    })
  }

}
