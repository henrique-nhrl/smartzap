import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { MensagemModelo } from '../entities/mensagemModelo';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MensagemModeloHttpService {
  private apiUrl = environment.apiUrl;;

  constructor(private http: HttpClient) { }

  getAll(clienteId: string | null){
    return this.http.get<MensagemModelo[]>(this.apiUrl + `/mensagensModelo/${clienteId}`);
  }

  selecionarPorTitulo(clienteId: number, titulo: string): Observable<any[]> {
    return this.http.get(this.apiUrl + `/mensagensModelo/selecionarPorTitulo/${clienteId}/${titulo}`).pipe(
      map((response: any) => response || [])
    );
  }

  getbyModeloId(id: number) {
    return this.http.get<MensagemModelo>(this.apiUrl + '/mensagemModelo/' + id ).pipe();
  }
}
