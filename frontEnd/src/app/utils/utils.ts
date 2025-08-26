import * as moment from "moment";
import { TerminalHttpService } from "../services/terminal-http.service";
import { environment } from "src/environments/environment";
import { WhatsappHttpService } from "../services/whatsapp-http.service";
import { NzNotificationService } from "ng-zorro-antd/notification";
import { Usuario } from "../entities/usuario";

export class Utils {
  static removeMascara(valor: string): string {
    if (valor) {
      return valor.replace(/[^0-9]/g, '');
    }
    return valor;
  }
  static formatDate(value: any) {
    return moment(value, moment.ISO_8601).format('DD/MM/YYYY');
  }

  static timeToDate(date: any, hora: any): Date {
    const [hour, minute, second] = hora.split(':').map(Number);

    return moment(date).hour(hour).minute(minute).second(second).toDate();
  }

  static dateToTime(data: any) {
    let date = new Date(data);

    // Extrair horas, minutos e segundos
    let hours = date.getHours().toString().padStart(2, '0');
    let minutes = date.getMinutes().toString().padStart(2, '0');
    let seconds = date.getSeconds().toString().padStart(2, '0');

    // Formatar a hora no formato HH:mm:ss
    let formattedTime = `${hours}:${minutes}:${seconds}`;

    // Aplicar a hora formatada na outra propriedade
    return formattedTime;
  }

  static validateEmail(email: string) {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }


  static async createApiInstance(
    terminalHttpService: TerminalHttpService,
    whatsappHttpService: WhatsappHttpService, // Ajuste conforme o tipo correto
    notification: NzNotificationService, // Ajuste conforme o tipo correto
    usuario: Usuario // Ajuste conforme o tipo correto
  ) {

    try {
      // Obter a apiKey
      //const response = (await terminalHttpService.getApiKey().toPromise());

      // Verificar se a apiKey está vazia
      // const apiKey = response?.apikey || ''; // Acessa a chave "apikey" no retorno JSON

      // if (!apiKey) {
      //   // Emitir notificação e sair da rotina
      //   notification.error('Erro', 'Erro ao conectar no telefone');
      //   return; // Sai da rotina se a apiKey for uma string vazia
      // }

      // Criar a instância com a apiKey obtida
      const retorno =  await whatsappHttpService.createInstance(
        usuario.apiurl, environment.defaultApiKey , usuario.apiinstanceid, usuario.apikey);

      // Verificar o retorno e notificar o usuário
      if (retorno) {
          // const terminal = {
          //   id: usuario.idtrm,
          //   apikey: apiKey
          // }
          // terminalHttpService.updateApiKey(terminal).subscribe({
          //   next: () => {
              notification.success('Informação', 'Instância criada com sucesso.');
          //   },
          //   error: (error) => {
          //     notification.error('Erro', 'Erro conectar no telefone');
          //     console.error('Erro conectar no telefone', error);
          //   }
          // });
      } else {
          notification.info('Informação','Erro conectar no telefone.');
      }
    } catch(error) {
      // Tratamento de erro
      notification.error('Erro', 'Erro conectar no telefone');
      console.error('Erro ao criar a instância:', error);
    }
  }


}
