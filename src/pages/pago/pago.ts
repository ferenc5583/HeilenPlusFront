import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'page-pago',
    templateUrl: 'pago.html'
})

export class PagoPage {

    total: any;
    comision: any;

    token = localStorage.getItem('token');

    constructor(public http: HttpClient, private auth: AuthService) {

    }

    ngOnInit() {
        this.http.get(`${this.auth.url}/contrato/suma/`, { headers: { 'Content-Type': 'application/json', 'Authorization': 'bearer ' + this.token } }).subscribe((r: any) => {
            this.total = r.suma_semana;
            this.comision = r.comision;
        })
    }

}