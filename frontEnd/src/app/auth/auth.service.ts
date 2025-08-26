import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
//import {HttpService} from '../shared/services/http.service';
import {TokenService} from './token.service';
import {Subscription} from 'rxjs';
//import {CookieService} from 'ngx-cookie-service';
import {OnDestroy} from '@angular/core';
//import {FacebookService} from '../shared/services/facebook.service';
import {HttpParams} from '@angular/common/http';
//import {RedeSocial} from '../entities/rede-social';
import {Login} from '../entities/interfaces/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService implements OnDestroy {
  //private readonly subscriber: Subscription;
  public token: string;

    constructor(/*private http: HttpService,*/
              private router: Router,
              private tokenService: TokenService,
              //private cookie: CookieService,
              /*private facebookService: FacebookService*/) {
    this.token = this.tokenService.getToken();
    // this.subscriber = this.tokenService.tokenChanged.subscribe(
    //   (token: string) => {
    //     this.token = token;
    //   });
  }

  ngOnDestroy() {
    // if (this.subscriber) {
    //   this.subscriber.unsubscribe();
    // }
  }

  // onLogin(user: Login, Sucesso?: () => void, Erro?: (Erro) => void) {
  //   let body = new HttpParams();
  //   let client_id = 'ErpGerencial';
  //   let client_secret = 'ErpGerencial';
  //   const dataEmissaoToken = new Date().getTime();

  //   if (user.lembrarMe) {
  //     client_id = 'ErpGerencialPersistente';
  //     client_secret = 'ErpGerencialPersistente';
  //   }

  //   body = body.set('username', user.email);
  //   body = body.set('password', user.senha);
  //   body = body.set('grant_type', 'password');
  //   body = body.set('client_id', client_id);
  //   body = body.set('client_secret', client_secret);
  //   body = body.set('scope', 'API');


  //   this.http.onPostType('connect/token', body, 'application/x-www-form-urlencoded').subscribe(
  //     (data: any) => {
  //       const token: string = data.access_token;
  //       this.tokenService.setToken(token);

  //       this.registraToken(dataEmissaoToken.toString(), token, user.lembrarMe);

  //       if (Sucesso) {
  //         Sucesso();
  //       }

  //     },
  //     (error) => {
  //       if (Erro) {
  //         Erro(error);
  //       }
  //     }
  //   );
  // }

  isAutenticado(): boolean {
    return !!this.token;
  }

  logOut() {
    // this.cookie.deleteAll('/');

    localStorage.removeItem('token');
    localStorage.removeItem('dataemissao');
    localStorage.removeItem('tempo');
    localStorage.removeItem('empresa');
    this.tokenService.setToken('');
    // this.router.navigate(['/']).then();
    window.location.href = 'http://weplug.me';
    // this.tokenService.setUsuarioLogado(undefined);
  }

  // onFacebookLogin(sucesso?: () => void, erro?: (Erro) => void, tipoEmpresa?: number, tokenConvite?: string) {
  //   const dataEmissaoToken = new Date().getTime();

  //   this.facebookService.getLoginStats(
  //     (response: any) => {
  //       const redeSocial = new RedeSocial();
  //       if (response.authResponse) {
  //         redeSocial.token = response.authResponse.accessToken;
  //         redeSocial.tokenConvite = tokenConvite;
  //         redeSocial.tipoEmpresa = tipoEmpresa;
  //         this.http.onPost('api/usuario/registrarporfacebook', redeSocial, false).subscribe(
  //           (dados: any) => {
  //             this.registraToken(dataEmissaoToken.toString(), dados.access_token, true);
  //             if (sucesso) {
  //               sucesso();
  //             }
  //           },
  //           (error: any) => {
  //             if (erro) {
  //               erro(error);
  //             }
  //           }
  //         );

  //       }
  //     });

  // }

  // onGoogleLogin(token: string, sucesso?: () => void, erro?: (Erro) => void, tipoEmpresa?: number, tokenConvite?: string, parceiroId?: number) {
  //   const dataEmissaoToken = new Date().getTime();
  //   if (token) {
  //     const redeSocial = new RedeSocial();
  //     redeSocial.tipoEmpresa = tipoEmpresa;
  //     redeSocial.tokenConvite = tokenConvite;
  //     redeSocial.parceiroId = parceiroId;
  //     redeSocial.token = token;
  //     this.http.onPost('api/usuario/registrarporgoogle', redeSocial, false).subscribe(
  //       (dados: any) => {
  //         this.registraToken(dataEmissaoToken.toString(), dados.access_token, true);
  //         if (sucesso) {
  //           sucesso();
  //         }
  //       },
  //       (error: any) => {
  //         if (erro) {
  //           erro(error);
  //         }
  //       }
  //     );
  //   }
  // }

  public registraToken(dataEmissao: string, token: string, lembrarMe: boolean) {
    this.tokenService.setToken(token);
    localStorage.setItem('token', token);
    localStorage.setItem('dataemissao', btoa(dataEmissao.toString()));
    localStorage.setItem('tempo', btoa('1'));

    // this.cookie.deleteAll('/');

    if (lembrarMe) {
      localStorage.setItem('tempo', btoa((100000).toString()));
      // this.cookie.set('token', token);
      // this.cookie.set('dataemissao', btoa(dataEmissao.toString()));
      // this.cookie.set('tempo', btoa((100000).toString()));
    }
  }
}

