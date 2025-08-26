import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './auth/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {NzMenuModule} from 'ng-zorro-antd/menu';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzAlertModule} from 'ng-zorro-antd/alert';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzPopconfirmModule} from 'ng-zorro-antd/popconfirm';
import {NzAvatarModule} from 'ng-zorro-antd/avatar';
import {NzSpinModule} from 'ng-zorro-antd/spin';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzNotificationModule } from 'ng-zorro-antd/notification';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MensagemDetailComponent } from './components/mensagem-detail/mensagem-detail.component';
import { MensagemListComponent } from './components/mensagem-list/mensagem-list.component';
import { RegistroComponent } from './components/registro/registro.component';
import { HttpClientModule } from '@angular/common/http';
import { DatePickerComponent } from './components/date-picker/date-picker.component';
import { TimePickerComponent } from './components/time-picker/time-picker.component';
import { IConfig, NgxMaskModule, NgxMaskPipe } from 'ngx-mask';
import { CookieService } from 'ngx-cookie-service';
import { JwtModule } from '@auth0/angular-jwt';
import { ModalQuestionComponent } from './components/modal-question/modal-question.component';
import { LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import  locale  from '@angular/common/locales/pt';
import { ModalInfoComponent } from './components/modal-info/modal-info.component';
import { DynamicFormComponent } from './components/dynamic-form/dynamic-form.component';
import { QrCodeDisplayComponent } from './components/qr-code-display/qr-code-display.component';
import { AccordionComponent } from './components/accordion/accordion.component';
import { CurrencyModalComponent } from './components/currency-modal/currency-modal.component';
import { MensagemModalComponent } from './components/mensagem-modal/mensagem-modal.component';
import { TimeMaskPipe } from './components/pipes/time-mask.pipe';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { CalculadorComponent } from './components/calculador/calculador.component';
import { environment } from 'src/environments/environment';
import { GoogleButtonComponent } from './components/google-button/google-button.component';
import { ModalNovoUsuarioComponent } from './components/modal-novo-usuario/modal-novo-usuario.component';
import { ModalRecuperarSenhaComponent } from './components/modal-recuperar-senha/modal-recuperar-senha.component';
import { ModalResetPasswordComponent } from './components/modal-reset-password/modal-reset-password.component';

registerLocaleData(locale, 'pt-BR');

export function tokenGetter() {
  return localStorage.getItem('token');
}
export const options: Partial<IConfig> | (() => Partial<IConfig>) = {};
// const maskConfig: Partial<IConfig> = {
//   validation: false,
// };

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MensagemDetailComponent,
    MensagemListComponent,
    RegistroComponent,
    DatePickerComponent,
    TimePickerComponent,
    ModalQuestionComponent,
    ModalInfoComponent,
    DynamicFormComponent,
    QrCodeDisplayComponent,
    AccordionComponent,
    CurrencyModalComponent,
    MensagemModalComponent,
    TimeMaskPipe,
    NavBarComponent,
    CalculadorComponent,
    GoogleButtonComponent,
    ModalNovoUsuarioComponent,
    ModalRecuperarSenhaComponent,
    ModalResetPasswordComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    NgbModule,
    NzMenuModule,
    NzButtonModule,
    NzCollapseModule,
    NzAlertModule,
    NzListModule,
    NzInputModule,
    NzInputNumberModule,
    NzDropDownModule,
    NzPopconfirmModule,
    NzAvatarModule,
    NzSpinModule,
    NzIconModule,
    NzTabsModule,
    NzCheckboxModule,
    NzNotificationModule,
    BrowserAnimationsModule,
    HttpClientModule,
    NgxMaskModule.forRoot(options), //5.161.253.43
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: [environment.apiDomain],
        disallowedRoutes: [`${environment.apiUrl}/login`, `${environment.apiUrl}/register`]
      }
    }),
    ReactiveFormsModule

  ],
  providers: [NgxMaskPipe,
    { provide: LOCALE_ID, useValue: 'pt-BR' }, // Definir fuso horário para 'America/Sao_Paulo'
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
