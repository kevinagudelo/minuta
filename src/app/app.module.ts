import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavComponent } from './componets/nav/nav.component';
import { DialogComponent } from './componets/dialog/dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { AuthModule } from '@auth0/auth0-angular';
import { MatPaginatorModule } from '@angular/material/paginator';


@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    DialogComponent,
  ],
  imports: [
    MatDialogModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    
    AuthModule.forRoot({
      domain: 'dev-q0rkk9yw.us.auth0.com', // Tu dominio de Auth0
    clientId: 'u0S5x5fObhYN6CbGW44pf5GycC0S6siV', // Tu Client ID de Auth0
    authorizationParams: {
      redirect_uri: window.location.origin, // URL a la que redirigirá después del login
      audience: 'https://hasura.minutausuers.com', // Audiencia configurada en Auth0
      scope: 'openid profile email', // Alcances que necesitas
    },
    cacheLocation: 'localstorage', // Opcional: Guarda tokens en localStorage (mejor para SPAs)
    useRefreshTokens: true, // Habilita el uso de Refresh Tokens
  }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
