import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { DetallePage } from '../detalle/detalle';
import { PagoPage } from '../pago/pago';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  contratos: any;

  token = localStorage.getItem('token');

  total: any;
  comision: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, private auth: AuthService) {

  }

  ngOnInit() {
    this.http.get(`${this.auth.url}/contrato/miscontratos/`, { headers: { 'Content-Type': 'application/json', 'Authorization': 'bearer ' + this.token } })
      .subscribe((res: any) => {
        this.contratos = res;
      })

      this.http.get(`${this.auth.url}/contrato/suma/`, { headers: { 'Content-Type': 'application/json', 'Authorization': 'bearer ' + this.token } }).subscribe((r: any)=>{
        this.total = r.suma_semana;
        this.comision = r.comision;
      })
  }

  doRefresh(refresher) {
    //durante la carga
    this.ngOnInit();

    setTimeout(() => {
      //despues de cargar
      refresher.complete();
    }, 500);
  }

  initializeItems() {
    this.contratos;
  }

  getItems(ev: any) {
    // Reset items back to all of the items
    this.initializeItems();

    // set val to the value of the searchbar
    const val = ev.target.value;

    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.contratos = this.contratos.filter((item) => {
        return (item.fecha.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.hora.toLowerCase().indexOf(val.toLowerCase()) > -1 || item.monto.toString().toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    } else {
      this.ngOnInit();
    }
  }

  goToDetalle(item){
    this.navCtrl.push(DetallePage, {
      id_cont: item.id
  });
  }

  pay(){
    this.navCtrl.push(PagoPage);
  }

}
