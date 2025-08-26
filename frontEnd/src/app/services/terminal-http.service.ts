import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Terminal } from 'src/app/entities/terminal';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TerminalHttpService {
  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient) { }

  getAll(clienteId: string | null){
    return this.http.get<Terminal[]>(this.apiUrl + `/terminais/${clienteId}`);
  };

  getApiKey(): Observable<{ apikey:string }> {
    return this.http.get<{ apikey:string }>(`${this.apiUrl}/getApiKey`);
  };

  updateApiKey(terminal: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateApiKey`, { terminal });
  }
}
