import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  contratos: any;

  token = localStorage.getItem('token');

  constructor(public navCtrl: NavController, public navParams: NavParams, public http: HttpClient, private auth: AuthService) {

  }

  ngOnInit() {
    this.http.get(`${this.auth.url}/contrato/miscontratos/`, { headers: { 'Content-Type': 'application/json', 'Authorization': 'bearer ' + this.token } })
      .subscribe((res: any) => {
        this.contratos = res;
      })
  }

}
