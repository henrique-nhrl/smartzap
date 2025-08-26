import { TerminalHttpService } from './../../services/terminal-http.service';
import { ContatoHttpService } from './../../services/contato-http.service';
import { Mensagem } from './../../entities/mensagem';
import { AuthHttpService } from 'src/app/services/auth-http.service';
import { MensagemModeloHttpService } from './../../services/mensagemModelo-http.service';
import { Contato } from './../../entities/contato';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { MensagemHttpService } from '../../services/mensagem-http.service';
import { ChangeDetectorRef, Component, NgZone, OnInit, ViewChild } from '@angular/core';
import { DateTime, TempusDominus } from '@eonasdan/tempus-dominus';
import { catchError, debounceTime, distinctUntilChanged, first, firstValueFrom, Observable, of, switchMap, timeout } from 'rxjs';
import {
  NgbTooltip,
  NgbModal,
  NgbTypeaheadSelectItemEvent,
  NgbTypeahead
} from '@ng-bootstrap/ng-bootstrap';
import { ModalQuestionComponent } from '../modal-question/modal-question.component';
import { ModalClose } from 'src/app/entities/enum/modal-close.enum';
import { ModalInfoComponent } from '../modal-info/modal-info.component';
import { Router } from '@angular/router';
import { MensagemModelo } from 'src/app/entities/mensagemModelo';
import { MensagemService } from 'src/app/services/mensagem.service';
import { Usuario } from 'src/app/entities/usuario';
import { DadosModelo } from 'src/app/entities/dadosModelo';
import { DynamicFormComponent } from '../dynamic-form/dynamic-form.component';
import { CampoForm } from 'src/app/entities/campoForm';
import { WhatsappHttpService } from 'src/app/services/whatsapp-http.service';
import { QrCodeDisplayComponent } from '../qr-code-display/qr-code-display.component';
import * as moment from 'moment';
import { NgxMaskPipe } from 'ngx-mask';
import { Utils } from 'src/app/utils/utils';

@Component({
  selector: 'app-mensagem-detail',
  templateUrl: './mensagem-detail.component.html',
  styleUrls: ['./mensagem-detail.component.scss']
})
export class MensagemDetailComponent implements OnInit {

  @ViewChild('typeahead', { static: false })
  typeahead: NgbTypeahead;

  public mensagem: Mensagem;
  public contatos: Contato[] = [];
  public selectedContato: Contato = new Contato();
  public usuario: Usuario;
  public modelos: MensagemModelo[] = [];
  private idCli: string | null;
  private idUsuario: string | null;
  public numOrigem: any = '0';
  public informarData: boolean = false;
  private bloquear: boolean = false;
  private dadosModelo: DadosModelo;
  private campos: CampoForm[] = [];
  public conectado: boolean = false;
  public qrCode: string = '';
  public isLoading: boolean = false;
  public contatoStr: string = '';
  public exibirDadosContato: boolean = false;


  public isProcessandoContato = false;
  public isProcessandoModelo = false;

  constructor(
    private notification: NzNotificationService,
    private mensagemService: MensagemService,
    private mensagemHttpService: MensagemHttpService,
    private contatoHttpService: ContatoHttpService,
    private mensagemModeloHttpService: MensagemModeloHttpService,
    private authHttpService: AuthHttpService,
    private modalService: NgbModal,
    private zone: NgZone,
    private router: Router,
    private whatsappHttpService: WhatsappHttpService,
    private maskPipe: NgxMaskPipe,
    private terminalHttpService: TerminalHttpService,
    private cdr: ChangeDetectorRef
    ) {
    this.limpaMensagem();
    this.usuario = {
      id:0,
      idcli:0,
      idtrm:0,
      nome:'',
      email: '',
      pwp: '',
      admin: true,
      inativo: false,
      empresanome: '',
      numtel: '',
      apiurl: '',
      apiinstanceid: '',
      apikey: '',
      apienabled: 'N',
    };
    this.dadosModelo = {
      modelo: '',
      horaAgendamento: '',
      contatoNome: '',
      empresaNome: '',
      usuarioEmail: '',
      usuarioNome: '',
      dias7: '',
      dias14: '',
      dias30: ''
    };
  }

  ngOnInit(): void {
    this.isLoading = true;

    const token = localStorage.getItem('token');

    if (!token) {
      this.isLoading = false;
      this.notification.info('Informação', 'Sessão expirada faça o login novamente');
      this.zone.run(() => this.router.navigate(['/login']));
      return
    }


    this.idCli = localStorage.getItem('idCli');
    this.idUsuario = localStorage.getItem('idUsuario');
    this.carregarUsuario();
    this.carregarModelos();
    this.isLoading = false;
  }

  async enviar()
  {
    if (await this.validar()) {
        this.processarEnvio();
    }
  }

  async processarEnvio(){
    this.isLoading = true;
    this.mensagem.idCli = Number(this.idCli);
    this.mensagem.idUsuario = Number(this.idUsuario);
    this.mensagem.idNumorigem = Number(this.usuario.idtrm);
    this.ajustaHoraLimite();
    this.mensagemHttpService.insertMessage(this.mensagem).subscribe(response => {
      this.isLoading = false;
      this.notification.success('Envio', 'Mensagem agendada com sucesso');
      this.limpaMensagem();
    }, err => {
      this.isLoading = false;
    })
  }

  onContatoChange(contato: string, index: number) {
    this.mensagem.numDestino = this.contatos[index].num;
  }

  onModeloChange(modelo: string, index: number) {
    this.dadosModelo.modelo = this.modelos[index].texto;
    this.dadosModelo.horaAgendamento = this.mensagem.hrAgend.getHours().toString();
    this.dadosModelo.contatoNome = this.mensagem.contato;
    this.dadosModelo.empresaNome = this.usuario.empresanome;
    this.dadosModelo.usuarioEmail = this.usuario.email;
    this.dadosModelo.usuarioNome = this.usuario.nome;
    this.dadosModelo.contatoNome = this.mensagem.contato;
    this.mensagem.mensagem = this.mensagemService.modelToMsg(this.dadosModelo)
    this.campos = this.mensagemService.generateCampos(this.mensagem.mensagem);
    if(this.campos.length > 0){
      this.openFormModal();
    }
  }

  async carregarUsuario() {
    const usuario = (await this.authHttpService.getUsuario(this.idUsuario).pipe(first()).toPromise().then()) as Usuario[];
    this.usuario = {
      id: usuario[0].id,
      idcli: usuario[0].idcli,
      idtrm: usuario[0].idtrm,
      nome: usuario[0].nome,
      email: usuario[0].email,
      pwp: '',
      admin: usuario[0].admin,
      inativo: usuario[0].inativo,
      empresanome: usuario[0].empresanome,
      numtel: usuario[0].numtel,
      apiurl: usuario[0].apiurl,
      apiinstanceid: usuario[0].apiinstanceid,
      apikey: usuario[0].apikey,
      apienabled: usuario[0].apienabled
    };
    if (this.usuario.idtrm == 0) {
      this.bloquear = true;
      this.aviso('Atenção','Você não possui nenhum número ativo');
    }
    const isConect = (await this.CheckInstanceConnection());
  }

  async carregarModelos() {
    this.mensagemModeloHttpService.getAll(this.idCli).subscribe(modelos => {
        modelos.forEach(p => {
          this.modelos.push({
            id: p.id,
            titulo: p.titulo,
            texto: p.texto
          });
        });
      }
    );
  }

  aviso(titulo: string, texto: string) {
    const modalRef = this.modalService.open(ModalInfoComponent, { keyboard: false,  centered: true, size: 'lg', backdrop: false, windowClass: 'modal-xl'});
    modalRef.componentInstance.titulo = titulo;
    modalRef.componentInstance.texto = texto;
  }

  async validar() {
    if(this.bloquear){
      this.notification.info('Atenção','Você não possui nenhum número ativo');
      return false;
    }

    if(this.usuario.apienabled == 'S' && !this.conectado){
      this.notification.info('Atenção','É preciso conectar o seu telefone');
      return false;
    }

    if(!this.validarContato())
      return

    if(this.informarData && !this.verificarDataHoraAgendamento()) {
      this.notification.info('Informação','Data/Hora informada é inferior a atual');
      const el = document.getElementById('dataAgendamento');
      el?.focus();
      return false;
    }

    if(!this.mensagem.mensagem){
      this.notification.info('Informação','Mensagem não informada');
      const el = document.getElementById('mensagem');
      el?.focus();
      return false;
    }
    const exists: boolean = (await this.whatsappHttpService.checkWhatsAppNumber(this.usuario.apiurl,
      this.usuario.apiinstanceid, this.usuario.apikey, this.mensagem.numDestino).pipe(first()).toPromise().then()) as boolean;

    if (!exists) {
      this.notification.info('Atenção','O número informado não possui WhatsApp')
      return false;
    }  else {return true};
  }

  onLogout(){
    localStorage.removeItem('token');
    localStorage.removeItem('idCli');
    localStorage.removeItem('idUsuario');
    this.zone.run(() => this.router.navigate(['/login']));
  }

  limparContato(){
    this.mensagem.contato = '';
    this.mensagem.numDestino = '';
    this.mensagem.mensagem = '';
    this.mensagem.modelo = '';
    this.mensagem.vrOportunidade = 0;
    this.contatoStr = '';
  }

  excluirContato(){
    const modalQ = this.modalService.open(ModalQuestionComponent, { keyboard: false,  centered: true, size: 'lg', backdrop: false, windowClass: 'modal-xl'});
    modalQ.componentInstance.titulo = 'Confirmação';
    modalQ.componentInstance.texto = `Deseja excluir o contato ${this.selectedContato.nome}?`;

    modalQ.result.then(
      result => {},
      reason => {
        if (reason === ModalClose.SIM) {
          this.contatoHttpService.excluir(Number(this.selectedContato.id)).subscribe(response => {
            this.limparContato();
            this.notification.success('Informação', 'Contato excluído com sucesso');
          })
        }
      });
  }

  openFormModal() {
    const modalRef = this.modalService.open(DynamicFormComponent, { backdrop: false});
    modalRef.componentInstance.campos = this.campos;
    modalRef.componentInstance.texto = this.mensagem.mensagem;
    modalRef.result.then((result) => {
      this.mensagem.mensagem = result;
    }, (reason) => {
    });
  }

  async CheckInstanceConnection(): Promise<boolean> {
    if (this.usuario.apienabled !== 'S') {
      this.conectado = true;
      this.isLoading = false;
      return false;
    }
    try {
      const retorno =  await firstValueFrom(this.whatsappHttpService.CheckInstanceConnection(this.usuario.apiurl, this.usuario.apiinstanceid, this.usuario.apikey));
      if (!retorno) {

        this.openQrCodeModal();
      } else {
        this.conectado = true;
        this.isLoading = false;
      }

      return retorno;
    } catch(console) {
      this.isLoading = false;
      return false;
    }
  }

  async openQrCodeModal() {
    await Utils.createApiInstance(this.terminalHttpService,
      this.whatsappHttpService,this.notification, this.usuario);

    const modalRef = this.modalService.open(QrCodeDisplayComponent, { keyboard: false,  centered: true, size: 'lg', backdrop: false, windowClass: 'modal-xl'});
    modalRef.componentInstance.qrCode = this.qrCode;
    modalRef.componentInstance.usuario = this.usuario;
    modalRef.result.then((result) => {
      this.conectado = result;
      this.isLoading = false;
    }, (reason) => {
      this.isLoading = false;
    });
  }

  verificarDataHoraAgendamento() {
    const dataHoraAtual = moment();
  const dataAgendada = moment(this.mensagem.dtAgend).format('YYYY-MM-DD'); // Extrair a data de dtAgend
  const horaAgendada = moment(this.mensagem.hrAgend).format('HH:mm'); // Extrair a hora de hrAgend

  // Combinar data e hora em um único objeto moment
  const dataHoraAgendada = moment(`${dataAgendada} ${horaAgendada}`, 'YYYY-MM-DD HH:mm');

  return dataHoraAgendada.isSameOrAfter(dataHoraAtual);
  }

  public searchContato = (text$: Observable<string>) =>
    text$.pipe(
      debounceTime(50),
      distinctUntilChanged(),
      switchMap(term => {
        if (this.contatoStr) {
          return this.contatoHttpService.selecionarPorNomeOuNumero(Number(this.idCli), this.contatoStr).pipe(catchError(() => of([])));
        } else {
            this.selectedContato.id = 0;
            this.selectedContato.nome = '';
            this.limparContato();
            return [];
        }
      })
  );

  public formatterContato = (x: {nome: string, num: string}) => x.nome + ' - ' + this.maskPipe.transform(x.num, '(00) 00000-0000');

  onSelectPersonFinder($event: NgbTypeaheadSelectItemEvent) {
    $event.preventDefault();
    this.contatoStr = this.formatterContato($event.item);
    this.selectedContato.id = $event.item.id;
    this.selectedContato.nome = $event.item.nome;
    this.mensagem.numDestino = $event.item.num;
    this.mensagem.contato = $event.item.nome;
  }

  limpaMensagem(){
    setTimeout(() => {
      this.mensagem = {id: 0,
        dtCriacao: new Date(),
        hrCriacao: new Date(),
        idCli: 0,
        idUsuario: 0,
        idNumorigem: 1,
        numDestino: '',
        contato: '',
        dtAgend: new DateTime(),
        hrAgend: new DateTime(),
        dtLimite: new Date(),
        hrLimite: new Date(),
        mensagem: '',
        prioridade: 0,
        vrOportunidade: 0,
        modelo: '',
      };
      this.informarData = false;
      this.contatoStr = '';
      this.cdr.detectChanges();
    }, 0);
  }

  isContatoSelected(): boolean {
    return !!this.selectedContato.id;
  }

  adicionarContato() {
    if(!this.validarContato())
      return
    const newContato = {
      idcli: Number(this.idCli),
      idusuario: Number(this.idUsuario),
      num: this.mensagem.numDestino,
      nome: this.mensagem.contato
    }

    this.contatoHttpService.inserir(newContato).subscribe(response => {
      this.selectContatoByNomeAndNumber(newContato);
      this.exibirDadosContato = false;
      this.notification.success('Informação','Informações salvas com sucesso');
      }, err => {
        this.notification.warning('Atenção', err.error.mensagem);
      }
    )
  }

  validarContato() {
    if(!this.mensagem.contato){
      this.notification.info('Informação','Contato não informado');
      const el = document.getElementById('nomeContato');
      el?.focus();
      return false;
    }

    const retornoNumCel = this.mensagemService.isValidNumCel(this.mensagem.numDestino);
    if(retornoNumCel.length > 0) {
      this.notification.info('Informação', retornoNumCel);
      const el = document.getElementById('telefone');
      el?.focus();
      return false;
    }
    return true
  }

  onInformarData(){
    if(!this.informarData) {
      this.mensagem.dtAgend = new DateTime();
      this.mensagem.hrAgend = new DateTime();
      this.mensagem.prioridade = 0;
      return;
    };

    const horaAtual = moment().add(1, 'hour').toDate();
    this.mensagem.dtAgend = new DateTime();
    this.mensagem.hrAgend = new DateTime(horaAtual);
    this.mensagem.prioridade = 1;
    this.carregarData('dataAgendamento', this.mensagem.dtAgend);
    this.carregarHora('horaAgendamento', this.mensagem.hrAgend);
  }

  editarContato(){
    if(!this.exibirDadosContato) {
      this.exibirDadosContato = !this.exibirDadosContato;
    };
    setTimeout(() => {
      const el = document.getElementById('novoContato');
      el?.focus();
    }, 1000);
  }

  adicionarNovoContato(){
    if(!this.exibirDadosContato) {
      this.exibirDadosContato = !this.exibirDadosContato;
    };
    this.limparContato();
    setTimeout(() => {
      const el = document.getElementById('novoContato');
      el?.focus();
    },1000);
  }

  onExibirDadosContato() {
    this.exibirDadosContato = !this.exibirDadosContato;
  }

  limpaFechaDadosContato(){
    this.limparContato();
    this.exibirDadosContato = false;
  }

  carregarData(componentName: string, value: DateTime) {
    const element = document.getElementById(componentName);
    if (element) {
      const datePicker = new TempusDominus(element, {
        display: {
          icons:{
            type: 'icons',
            time: 'bi bi-clock',
            date: 'bi bi-calendar-week',
            up: 'bi bi-arrow-up-circle',
            down: 'bi bi-arrow-down-circle',
            previous: 'bi bi-arrow-left-circle',
            next: 'bi bi-arrow-right-circle',
            today: 'bi bi-calendar-check',
            clear: 'bi bi-trash',
            close: 'bi bi-x-circle'
          },
          theme: 'light',
          components: {
            calendar: true,
            date: true,
            month: true,
            year: true,
            decades: true,
            clock: false,
            hours: false,
            minutes: false,
            seconds: false
          }
        },
        localization: {
          locale: 'pt-BR', // Define a localidade (locale)
          format: 'dd/MM/yyyy' // Define o formato da data
        }
      });

      element.addEventListener('change.td', (e: any) => {
        value = new DateTime(e.detail.date);
        //this.dateModelChange.emit(this.dateModel);
      });

      if (value) {
        datePicker.dates.setValue(value);
      }
    }
  }

  carregarHora(componentName: string, value: DateTime) {
    const element = document.getElementById(componentName);
    if (element) {
      const timePicker = new TempusDominus(element, {
        display: {
          icons:{
            type: 'icons',
            time: 'bi bi-clock',
            date: 'bi bi-calendar-week',
            up: 'bi bi-arrow-up-circle',
            down: 'bi bi-arrow-down-circle',
            previous: 'bi bi-arrow-left-circle',
            next: 'bi bi-arrow-right-circle',
            today: 'bi bi-calendar-check',
            clear: 'bi bi-trash',
            close: 'bi bi-x-circle'
          },
          theme: 'light',
          viewMode: 'clock',
          components: {
            decades: false,
            year: false,
            month: false,
            date: false,
            hours: true,
            minutes: true,
            seconds: false
          }
        },
        localization: {
          locale: 'pt-BR', // Define a localidade (locale)
          format: 'HH:mm' // Define o formato da data
        },
      });

      element.addEventListener('change.td', (e: any) => {
        value = new DateTime(e.detail.date);
        //this.dateModelChange.emit(this.dateModel);
      });

      // Initialize picker with current dateModel value
      if (value) {
        timePicker.dates.setValue(value);
      }
    }
  }

  ajustaHoraLimite() {
    if(!this.informarData) {
      this.mensagem.dtAgend = new DateTime();
      this.mensagem.hrAgend = new DateTime();
    };

    const hrAgend = this.mensagem.hrAgend.getHours(); // Obtém a hora de hrLimite
    if (hrAgend >= 23) {
      // Se hrLimite for 23 ou mais, incrementa o dia de dtAgend
      const novaData = new Date(this.mensagem.dtAgend);
      novaData.setDate(novaData.getDate() + 1);
      this.mensagem.dtLimite = novaData;
    } else {
      this.mensagem.dtLimite = this.mensagem.dtAgend;
    }

    // Ajusta hrLimite para 1 hora a mais que hrAgend
    this.mensagem.hrLimite = new Date(this.mensagem.hrAgend.getTime() + 1 * 60 * 60 * 1000);
  }

  onCalculadorValorChange(event: {valor: number, unidade: string}) {
    let novaData = moment(); // Começando da data atual

    if (event.unidade === 'meses') {
      novaData = novaData.add({ months: event.valor });
    } else if (event.unidade === 'dias') {
      novaData = novaData.add({ days: event.valor });
    }

    // Converte a data do Moment.js para DateTime
     const novaDataDateTime = new DateTime(novaData.toDate());

    // Atualiza o datePicker com a nova data calculada
    this.carregarData('dataAgendamento', novaDataDateTime);
  }

  infoModelo(){
    this.notification.info('Informação','Para selecionar o modelo, primeiro selecionar o contato');
  }

  selectContatoByNomeAndNumber(contato: Contato) {
    const contatoEncontrado = this.contatoHttpService.selecionarPorNomeENumero(contato).pipe(
      catchError(() => of([]))
    );
    // Subscrição ao Observable para obter o resultado
    contatoEncontrado.subscribe(response => {
      if (response.length > 0) {
        const event = {
          item: response[0],
          preventDefault: () => {}
        };
        this.onSelectPersonFinder(event);
      } else {
        this.notification.info('Informação','Contato não encontrado');
      }
    });
  }


}
