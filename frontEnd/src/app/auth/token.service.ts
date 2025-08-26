import {Subject} from 'rxjs';
import {Injectable} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';
import {Usuario} from '../entities/usuario';
//import {IUsuarioEmpresaVinculada} from '../entities/usuario-empresa-vinculadas';
//import {UsuarioEmpresaService} from '../principal/services/usuario-empresa.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {environment} from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class TokenService {

  public tokenChanged = new Subject<String>();
  public usuarioLogadoChanged = new Subject<Usuario | undefined>();
  public tokenInvalido = new Subject<boolean>();
  private token = '';
  private usuario: Usuario | undefined;

  constructor(private cookie: CookieService,
              private http: HttpClient,
              private route: ActivatedRoute,
              private router: Router,
              /*private usuarioEmpresaService: UsuarioEmpresaService*/) {
  }

  setToken(novoToken: string): void {
     this.token = novoToken;
     localStorage.setItem('token', novoToken);

    const cookie = this.cookie.getAll();
    let cookieToken = this.cookie.get('token');

     if ((cookie) && (cookieToken) && (cookieToken.toString() !== '')) {
       cookieToken = novoToken;
       this.cookie.set('token', cookieToken);
     }
     this.atualizaUsuarioLogado();
     this.tokenChanged.next(novoToken);
  }

  getToken(): string {
    // let token;
    // const cookie = this.cookie.getAll();
    // this.token = '';

    // token = cookie['token'];
    // if ((token) && (token.toString() !== '')) {
    //   token = token.toString();

    //   if (!this.tokenValido(atob(cookie['dataemissao']), +atob(cookie['tempo']))) {
    //     this.token = '';
    //   }

    //   this.token = token;
    //   this.atualizaUsuarioLogado();
    //   this.tokenChanged.next(this.token);
    //   return this.token;
    // }

    // token = localStorage.getItem('token');
    // if ((token) && (token.toString() !== '')) {
    //   this.token = token.toString();

      // if (!this.tokenValido(atob(localStorage.getItem('dataemissao')), +atob(localStorage.getItem('tempo')))) {
      //   this.token = '';
      // }

    //   this.atualizaUsuarioLogado();
    //   this.tokenChanged.next(this.token);
    //   return this.token;
    // }


    // this.tokenChanged.next(this.token);
    // return this.token;
    return '';
  }

  setUsuarioLogado(usuario: Usuario | undefined) {
     this.usuario = usuario;
    this.usuarioLogadoChanged.next(usuario);
  }

  private atualizaUsuarioLogado() {
     if (this.token === '') {
       this.setUsuarioLogado(undefined);
       return;
     }

    let header = new HttpHeaders();
    const token: string = 'bearer ' + this.token.toString();
    header = header.append('Content-Type', 'application/json');
    header = header.append('Authorization', token);


    // this.http.get(environment.pathAPI + 'api/Usuario/usuarioToken', {headers: header}).subscribe(
    //   (user: IUsuarioEmpresaVinculada) => {
        //  const usuarioToken = user;
    //     this.usuarioEmpresaService.setUsuarioEmpresa(usuarioToken);
        //  this.setUsuarioLogado(usuarioToken.usuarioLogado);
    //   },
    //   () => {
    //     this.router.navigate(['/login/']).then(
    //       () => {
    //         this.tokenInvalido.next(true);
    //         this.setToken('');
    //       }
    //     );

    //   }
    // );

  }

  private tokenValido(dataEmissao: string, tempo: number): boolean {
    const dtEmissao = new Date(+dataEmissao);
    const dtValidade = dtEmissao.getTime() + (1000 * 60 * 60 * tempo * 12);

    const dtAtual = new Date().getTime();

    return (dtAtual <= dtValidade);
  }
}
