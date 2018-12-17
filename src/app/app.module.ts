import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { RutaPage } from '../pages/ruta/ruta';
import { InicioSesionPage } from '../pages/inicio-sesion/inicio-sesion';
import { RegistrarsePage } from '../pages/registrarse/registrarse';
import { MiCuentaPage } from '../pages/mi-cuenta/mi-cuenta';
import { RestaurarContrasenaPage } from '../pages/restaurar-contrasena/restaurar-contrasena';
import { CambiarPage } from '../pages/cambiar/cambiar';
import { PrecontratoPage } from '../pages/precontrato/precontrato';
import { DetallePage } from '../pages/detalle/detalle';
import { CierrePage } from '../pages/cierre/cierre';
import { TerminosPage } from '../pages/terminos/terminos';
import { SobrePage } from '../pages/sobre/sobre';
import { PagoPage } from '../pages/pago/pago';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { AgmCoreModule } from '@agm/core';
import { AgmDirectionModule } from 'agm-direction'

import { HttpClientModule } from '@angular/common/http';
import { HttpModule } from '@angular/http';
import { AuthService } from '../services/auth.service';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { Diagnostic } from '@ionic-native/diagnostic';

import { LocalNotifications } from '@ionic-native/local-notifications';

import {DatePipe} from '@angular/common';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    RutaPage,
    InicioSesionPage,
    RegistrarsePage,
    MiCuentaPage,
    RestaurarContrasenaPage,
    CambiarPage,
    PrecontratoPage,
    DetallePage,
    CierrePage,
    TerminosPage,
    SobrePage,
    PagoPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAxzUOUr8XRiAPvL5sdhs7gYhC8_GxWrEU',
      libraries: ['geometry']
    }),
    AgmDirectionModule,
    HttpClientModule,
    HttpModule,
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    RutaPage,
    InicioSesionPage,
    RegistrarsePage,
    MiCuentaPage,
    RestaurarContrasenaPage,
    CambiarPage,
    PrecontratoPage,
    DetallePage,
    CierrePage,
    TerminosPage,
    SobrePage,
    PagoPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Geolocation,
    AuthService,
    DatePipe,
    OpenNativeSettings,
    Diagnostic,
    LocalNotifications,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
