import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class WhatsappHttpService {
  private apiUrl = environment.externalApiUrl;
  constructor(private http: HttpClient) { }

  getApiUrl(serverURL: string): string {
    if (serverURL === 'http://5.161.236.185:8080') {
     return this.apiUrl;
    } else return serverURL;
  }

  checkWhatsAppNumber(serverURL: string, instanceID: string, apiKey: string, number: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': apiKey
    });
    const body = {
      numbers: ['55'+number]
    };
    const url = this.getApiUrl(serverURL);
    return this.http.post<any>(`${url}/chat/whatsappNumbers/${instanceID}`, body, { headers }).pipe(
      map(response => {
        return response[0].exists;
      })
    );

  }

  CheckInstanceConnection(serverURL: string, instanceID: string, apiKey: string): Observable<boolean> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': apiKey
    });
    const url = this.getApiUrl(serverURL);
    return this.http.get<any>(`${url}/instance/connectionState/${instanceID}`, { headers, responseType: 'text' as 'json' }).pipe(
      timeout(3000),
      catchError(error => {
        console.error('Erro ao verificar a conexão: ', error.message);
        return of(false);
      }),
      map(responseText => responseText.includes('open'))
    );
  };

  GetQRCODE(serverURL: string, instanceID: string, apiKey: string): Observable<string> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'apikey': apiKey
    });
    const url = this.getApiUrl(serverURL);
    return this.http.get<any>(`${url}/instance/connect/${instanceID}`, { headers }).pipe(
      map(response => {
        return response.base64;
      })
    );
  };

  async createInstance(serverURL: string, apiKey: string, instanceID: string, instanceToken: string): Promise<boolean> {
    const url = this.getApiUrl(serverURL);
    const formattedURL = `${url}/instance/create`;

    const payload = {
        instanceName: instanceID,
        token: instanceToken,
        qrcode: true,
        integration: 'WHATSAPP-BAILEYS',
        webhook: '',
        webhook_by_events: false,
        events: ['APPLICATION_STARTUP'],
        reject_call: false,
        msg_call: '',
        groups_ignore: true,
        always_online: false,
        read_messages: false,
        read_status: false,
        websocket_enabled: false,
        websocket_events: ['APPLICATION_STARTUP'],
        rabbitmq_enabled: false,
        rabbitmq_events: ['APPLICATION_STARTUP'],
        sqs_enabled: false,
        sqs_events: ['APPLICATION_STARTUP']
    };

    try {
        const response = await fetch(formattedURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': apiKey
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        // Você pode processar a resposta aqui se necessário

        return true;
    } catch (error) {
        console.error('Erro ao criar instância:', error);
        return false;
    }
  }

}
