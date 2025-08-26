import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { MensagemGrid } from '../entities/forms/mensagemGrid';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MensagemHttpService {
  private apiUrl = environment.apiUrl;;

  constructor(private http: HttpClient) { }

  insertMessage(message: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/mensagem`, message);
  }

  getMessages(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  cancelar(codigo: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/mensagem/cancelar/${codigo}`, { });
  }

  getMessage(codigo: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/mensagem/${codigo}`);
  }


  atualizarValorOportunidade(mensagem: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/mensagem/updateValorOportundade`, mensagem);
  }

  atualizarModalMensagem(mensagem: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/mensagem/updateModalMensagem`, mensagem);
  }

  getMessagesNotSend(filtro: any): Observable<any> {
    const header = new HttpHeaders().set( 'Content-Type','application/json');
    return this.http.post(`${this.apiUrl}/mensagens/getMsgsNotSend`, filtro, {headers: header});
  }

  getMsgsSend(filtro: any): Observable<any> {
    const header = new HttpHeaders().set( 'Content-Type','application/json');
    return this.http.post(`${this.apiUrl}/mensagens/getMsgsSend`, filtro, {headers: header});
  }

  getMsgsScheduleToday(filtro: any): Observable<any> {
    const header = new HttpHeaders().set( 'Content-Type','application/json');
    return this.http.post(`${this.apiUrl}/mensagens/getMsgsScheduleToday`, filtro, {headers: header});
  }

  getMsgsSendToday(filtro: any): Observable<any> {
    const header = new HttpHeaders().set( 'Content-Type','application/json');
    return this.http.post(`${this.apiUrl}/mensagens/getMsgsSendToday`, filtro, {headers: header});
  }

  getMsgsPendentToday(filtro: any): Observable<any> {
    const header = new HttpHeaders().set( 'Content-Type','application/json');
    return this.http.post(`${this.apiUrl}/mensagens/getMsgsPendentToday`, filtro, {headers: header});
  }

  getMsgsCanceled(filtro: any): Observable<any> {
    const header = new HttpHeaders().set( 'Content-Type','application/json');
    return this.http.post(`${this.apiUrl}/mensagens/getMsgsCanceled`, filtro, {headers: header});
  }

  getMsgsAll(filtro: any): Observable<any> {
    const header = new HttpHeaders().set( 'Content-Type','application/json');
    return this.http.post(`${this.apiUrl}/mensagens/getMsgsAll`, filtro, {headers: header});
  }

}
