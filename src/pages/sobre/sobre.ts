import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { TerminosPage } from '../terminos/terminos';

@Component({
    selector: 'page-sobre',
    templateUrl: 'sobre.html'
})

export class SobrePage {

    constructor(public navCtrl: NavController) {

    }

    goToTerminos(){
        this.navCtrl.push(TerminosPage);
    }

}
