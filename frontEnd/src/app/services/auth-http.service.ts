import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { Login } from 'src/app/entities/interfaces/login.model';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Usuario } from '../entities/usuario';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthHttpService {
  private apiUrl = environment.apiUrl;
  private jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient,
    private authService: AuthService
  ) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  login(credentials: any): Observable<any> {

    const header = new HttpHeaders().set( 'Content-Type','application/json');
    return this.http.post(`${this.apiUrl}/login`, credentials, {headers: header});

    //return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  inserir(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/usuario`, credentials);
  }

  private getHeaders(autorizacao: boolean = false, asJson: boolean = true): HttpHeaders {
    let headers = new HttpHeaders();
    if (asJson) {
      headers = headers.append('Content-Type', 'application/json');
    } else {
      headers = headers.append('Content-Type', 'text/plain');
    }

    // if (autorizacao) {
    //   headers = headers.append('Authorization', this.authService.getItemWithExpiration('token'));
    // }


    return headers;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('token');
    return (token !== '') && !this.jwtHelper.isTokenExpired(token);
  }

  getUsuario(userId: string | null){
    //const header = this.getHeaders(true, true);
    return this.http.get<Usuario>(this.apiUrl + `/usuario/${userId}`);
  }
  getByEmail(email: string){
    return this.http.get<Usuario>(this.apiUrl + `/usuario/getByEmail/${email}`)
  }
  getUsuarioEmpresa(){
    return this.http.get<Usuario>(this.apiUrl + `/usuarioEmpresa`)
  }

  forgotPassword(email: string) {
    return this.http.post(this.apiUrl + `/forgotPassword`, { email });
  }

  resetPassword(token: string, newPassword: string ) {
    return this.http.post(this.apiUrl + `/resetPassword`, { token, newPassword });
  }


}
