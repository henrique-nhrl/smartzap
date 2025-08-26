import { Usuario } from './../entities/usuario';
import { WhatsappHttpService } from './whatsapp-http.service';
import { Injectable } from '@angular/core';
import { DadosModelo } from '../entities/dadosModelo';
import { CampoForm } from '../entities/campoForm';

@Injectable({
  providedIn: 'root'
})
export class MensagemService {
  private textPattern = /%([^%]+)%/g;
  private comboPattern = /\|([^|[]+)\[([^\]]+)]\|/g;
  private valuePattern = /&([^&]+)&/g;
  private datePattern = /@([^@]+)@/g;

  modelToMsg(dadosModelo: DadosModelo): string {
    let finalText = dadosModelo.modelo;

    finalText = finalText.replace(/%saudacao%/g, this.getGreeting(dadosModelo.horaAgendamento));
    // Extrair o primeiro nome do contato
    const primeiroNomeContato = dadosModelo.contatoNome.split(' ')[0];
    finalText = finalText.replace(/%contato%/g, primeiroNomeContato);
    finalText = finalText.replace(/%dataatual%/g, new Date().toLocaleDateString());
    finalText = finalText.replace(/%nomeempresa%/g, dadosModelo.empresaNome);
    finalText = finalText.replace(/%emailusuario%/g, dadosModelo.usuarioEmail);
    finalText = finalText.replace(/%nomeusuario%/g, dadosModelo.usuarioNome);
    finalText = finalText.replace(/%7dias%/g, dadosModelo.dias7);
    finalText = finalText.replace(/%14dias%/g, dadosModelo.dias14);
    finalText = finalText.replace(/%30dias%/g, dadosModelo.dias30);

    return finalText;
  }

  getGreeting(hour: string): string {
    // Implemente a lógica para obter a saudação com base na hora fornecida
    // Por exemplo, pode retornar "Bom dia", "Boa tarde" ou "Boa noite"
    const hr = parseInt(hour, 10);
    if (hr < 12) return "Bom dia";
    if (hr < 18) return "Boa tarde";
    return "Boa noite";
  }

  generateCampos(text: string): CampoForm[] {
    const campos: CampoForm[] = [];
    let match;

    // Encontrar campos de texto
    while ((match = this.textPattern.exec(text)) !== null) {
      campos.push({ Nome: match[1], Tipo: 'etEdit' });
    }

    // Encontrar campos de combo
    while ((match = this.comboPattern.exec(text)) !== null) {
      const itensCombo = match[2].split(',').map(item => item.trim());
      campos.push({ Nome: match[1], Tipo: 'etCombo', ItensCombo: itensCombo });
    }

    // Encontrar campos de valor
    while ((match = this.valuePattern.exec(text)) !== null) {
      campos.push({ Nome: match[1], Tipo: 'etEdit' });
    }

    // Encontrar campos de data
    while ((match = this.datePattern.exec(text)) !== null) {
      campos.push({ Nome: match[1], Tipo: 'etTimePicker' });
    }

    return campos;
  }

  isValidNumCel(numero: string) {

    if (numero.length !== 10 && numero.length !== 11) {
        return 'Ops.. Parece que está faltando algo no número informado!';
    };

    if (numero.length === 11) {
      if (numero[2] !== '9') {
           return 'Ops.. Número de celular inválido!';
      } else {
        return '';
      }
    };

    if (numero.length === 10) {
      if (numero[2] === '9') {
          return 'Ops.. Falta um número no celular informado!';
      } else {
        return '';
      }
    };

    return '';
  }


}
