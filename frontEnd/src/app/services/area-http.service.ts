import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Area } from '../entities/area';

@Injectable({
  providedIn: 'root'
})
export class AreaHttpService {
  private apiUrl = environment.apiUrl;;

  constructor(private http: HttpClient) { }

  // inserir(cliente: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/cliente`, cliente);
  // }

   getAll(){
     return this.http.get<Area[]>(this.apiUrl + `/areas`);
   }

  // selecionarPorNome(clienteId: number, nome: string): Observable<any[]> {
  //   return this.http.get(this.apiUrl + `/contatos/consultarPorNome/${clienteId}/${nome}`).pipe(
  //     map((response: any) => response || [])
  //   );
  // }

  // selecionarPorNumero(clienteId: number, numero: string): Observable<any[]> {
  //   return this.http.get(this.apiUrl + `/contatos/consultarPorNumero/${clienteId}/${numero}`).pipe(
  //     map((response: any) => response || [])
  //   );
  // }

  // selecionarPorNomeOuNumero(clienteId: number, texto: string): Observable<any[]> {
  //   return this.http.get(this.apiUrl + `/contatos/consultarPorNomeOuNumero/${clienteId}/${texto}`).pipe(
  //     map((response: any) => response || [])
  //   );
  // }

  // getbyContatoId(id: number) {
  //   return this.http.get<Contato>(this.apiUrl + '/contatos/getByContatoId/' + id ).pipe();
  // }

  // getByNumber(clienteId:number, numero: string) {
  //   return this.http.get<Contato[]>(this.apiUrl + `/contatos/buscarPorNumero/${clienteId}/${numero}`).pipe();
  // }

  // excluir(codigo: number){
  //   return this.http.delete(`${this.apiUrl}/contato/${codigo}`)
  // }

}
