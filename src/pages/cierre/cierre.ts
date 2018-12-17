import { Component } from '@angular/core';
import { NavParams, AlertController, NavController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { HomePage } from '../home/home';
import { AuthService } from '../../services/auth.service';
import { TerminosPage } from '../terminos/terminos';

@Component({
    selector: 'page-cierre',
    templateUrl: 'cierre.html'
})

export class CierrePage {

    id_cont: any;

    id_cali: any;

    monto: any;

    before: boolean = false;

    constructor(public navParams: NavParams, public http: HttpClient, public alertCtrl: AlertController, public navCtrl: NavController, public auth: AuthService) {

        this.id_cont = navParams.get('id_cont');

    }

    ngOnInit(){
        this.http.get(`${this.auth.url}/contrato/${this.id_cont}`).subscribe((res: any) => {
            this.monto = res.monto;
        })
    }

    pay() {
        this.http.put(`${this.auth.url}/contrato/estadoTer/${this.id_cont}`, {}).subscribe((r: any) => {
            this.navCtrl.setRoot(HomePage);
        })
    }

    goToTerminos(){
        this.navCtrl.push(TerminosPage);
    }
}