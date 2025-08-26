import { MensagemHttpService } from './../../services/mensagem-http.service';
import { Component, OnInit, Input } from '@angular/core';
import { MensagemGrid } from 'src/app/entities/forms/mensagemGrid';
import { Usuario } from 'src/app/entities/usuario';
import { NzNotificationService } from 'ng-zorro-antd/notification';
import { FiltroMensagem } from 'src/app/entities/enum/filtro-Mensagem';
import { DadosFiltroMensagem } from 'src/app/entities/interfaces/dadosFiltroMensagem';
import { StatusMensagem } from 'src/app/entities/enum/status-Mensagem';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CurrencyModalComponent } from '../currency-modal/currency-modal.component';
import { MensagemModalComponent } from '../mensagem-modal/mensagem-modal.component';
import { DateTime } from '@eonasdan/tempus-dominus';
import { Utils } from 'src/app/utils/utils';
import { MensagensConsulta } from 'src/app/entities/forms/mensagensConsulta';

@Component({
  selector: 'app-mensagem-list',
  templateUrl: './mensagem-list.component.html',
  styleUrls: ['./mensagem-list.component.scss']
})
export class MensagemListComponent implements OnInit {
  @Input() usuario: Usuario;

  mensagens: MensagemGrid[];
  filtro: DadosFiltroMensagem;
  totalMensagens = 0;
  totalOportunidades = 0;
  textoFiltro = '';
  consultandoMensagem = false;
  FiltroMensagem: typeof FiltroMensagem = FiltroMensagem;
  filtroMensagem = FiltroMensagem.NotSend;
  public loadingMore = false;

  records: any[] = [];
  currentPage: number = 1;
  totalPages: number = 1;
  limit: number = 10;

  // pageSize: number = 10;

  lstStatusMensagem = [
    {
      name: 'Ver Mensagens Criadas Hoje',
      value: FiltroMensagem.ScheduleToday.valueOf(),
    },
    {
      name: 'Ver Mensagens Enviadas',
      value: FiltroMensagem.Send.valueOf(),
    },
    // {
    //   name: 'Ver Mensagens A Enviar',
    //   value: FiltroMensagem.PendentToday.valueOf(),
    // },
    {
      name: 'Ver Mensagens Canceladas',
      value: FiltroMensagem.Canceled.valueOf(),
    },
    {
      name: 'Ver Mensagens Aguardando Envio',
      value: FiltroMensagem.NotSend.valueOf(),
    },
    {
      name: 'Ver Mensagens Todas',
      value: FiltroMensagem.All.valueOf(),
    },
  ];

  constructor(
    private notification: NzNotificationService,
    private mensagemHttpService: MensagemHttpService,
    private modalService: NgbModal,
  ) {
    this.lstStatusMensagem = [
      {
        name: 'Ver Mensagens Criadas Hoje',
        value: FiltroMensagem.ScheduleToday.valueOf(),
      },
      {
        name: 'Ver Mensagens Enviadas',
        value: FiltroMensagem.Send.valueOf(),
      },
      // {
      //   name: 'Ver Mensagens A Enviar',
      //   value: FiltroMensagem.PendentToday.valueOf(),
      // },
      {
        name: 'Ver Mensagens Canceladas',
        value: FiltroMensagem.Canceled.valueOf(),
      },
      {
        name: 'Ver Mensagens Aguardando Envio',
        value: FiltroMensagem.NotSend.valueOf(),
      },
      {
        name: 'Ver Mensagens Todas',
        value: FiltroMensagem.All.valueOf(),
      },
    ];
   }

  ngOnInit(): void {
    this.filtro = {
      idCli: this.usuario.idcli,
      idUser: this.usuario.id,
      adminUser: this.usuario.admin,
      texto: '',
      page: 1,
      limit: 10,
    }
    this.mensagemHttpService.getMessagesNotSend(this.filtro).subscribe(response => {
      this.setMensagens(response);
      }, err => {
        this.notification.warning('Atenção', err.error.mensagem);
      }
    )
  }

  filterByType() {
    this.prepareLoad();
    this.goToPage(1);
    this.onSearchUpdated();
    // this.filter().subscribe((vendas) => {
    //   this.setTotalVendas(vendas[0]);
    //   this.setVendas(vendas);
    // });
  }

  onSearchUpdated() {
    this.filtro = {
      idCli: this.usuario.idcli,
      idUser: this.usuario.id,
      adminUser: this.usuario.admin,
      texto: this.textoFiltro,
      page: this.currentPage,
      limit: this.limit
    }

    if (this.filtroMensagem == FiltroMensagem.NotSend) {
      this.getMessagesNotSend()
    }
    if (this.filtroMensagem == FiltroMensagem.Send) {
      this.getMsgsSend()
    }
    if (this.filtroMensagem == FiltroMensagem.ScheduleToday) {
      this.getMsgsScheduleToday()
    }
    if (this.filtroMensagem == FiltroMensagem.SendToday) {
      this.getMsgsSendToday()
    }
    if (this.filtroMensagem == FiltroMensagem.PendentToday) {
      this.getMsgsPendentToday()
    }
    if (this.filtroMensagem == FiltroMensagem.Canceled) {
      this.getMsgsCanceled()
    }
    if (this.filtroMensagem == FiltroMensagem.All) {
      this.getMsgsAll()
    }
  }

  cancelMessage(mensagem: MensagemGrid) {
    const modalRef = this.modalService.open(MensagemModalComponent, { keyboard: false,  centered: true, size: 'lg', backdrop: false, windowClass: 'modal-xl'});
    modalRef.componentInstance.title = "Cancelar Mensagem";
    modalRef.componentInstance.disabledtextValue = true;
    modalRef.componentInstance.disabledCurrencyValue = true;

    modalRef.componentInstance.textValue = mensagem.mensagem;
    modalRef.componentInstance.dtAgendValue = new DateTime(mensagem.dtagend);
    modalRef.componentInstance.hrAgendValue = new DateTime(mensagem.hragend);
    modalRef.componentInstance.currencyValue = mensagem.vroportunidade;
    modalRef.componentInstance.disableddtAgendValue = true;
    modalRef.componentInstance.disabledhrAgendValue = true;
    modalRef.result.then((result) => {
      this.mensagemHttpService.cancelar(mensagem.id).subscribe(response => {
        this.notification.success('Informação','Mensagem cancelada com sucesso');
        this.filterByType();
        }, err => {
          this.notification.warning('Atenção', err.error.mensagem);
        }
      )
    }, (reason) => {
    });
  }

  UpdateVrOportunidade(mensagem: MensagemGrid) {
    const modalRef = this.modalService.open(MensagemModalComponent, { keyboard: false,  centered: true, size: 'lg', backdrop: false, windowClass: 'modal-xl'});
    modalRef.componentInstance.title = " Alterar/Visualizar Mensagem";
    modalRef.componentInstance.disabledtextValue = true;
    modalRef.componentInstance.disabledCurrencyValue = false;
    modalRef.componentInstance.disableddtAgendValue = true;
    modalRef.componentInstance.disabledhrAgendValue = true;
    modalRef.componentInstance.textValue = mensagem.mensagem;
    modalRef.componentInstance.dtAgendValue = new DateTime(mensagem.dtagend);
    modalRef.componentInstance.hrAgendValue = new DateTime(mensagem.hragend);
    modalRef.componentInstance.currencyValue = mensagem.vroportunidade;

    modalRef.result.then((result) => {
      this.updateTotalOportunidade(mensagem.vroportunidade, result.currencyValue);
      mensagem.vroportunidade = result.currencyValue;
      const thinMessage = {id: mensagem.id, vroportunidade: mensagem.vroportunidade};
      this.mensagemHttpService.atualizarValorOportunidade(thinMessage).subscribe(response => {
        this.notification.info('Informação','Valor da oportunidade atualizado com sucesso');
        }, err => {
          this.notification.warning('Atenção', err.error.mensagem);
        }
      )
    }, (reason) => {
    });
  }

  UpdateMensagem(mensagem: MensagemGrid) {
    const modalRef = this.modalService.open(MensagemModalComponent, { keyboard: false,  centered: true, size: 'lg', backdrop: false, windowClass: 'modal-xl'});
    modalRef.componentInstance.title = " Alterar/Visualizar Mensagem";
    modalRef.componentInstance.textValue = mensagem.mensagem;
    modalRef.componentInstance.dtAgendValue = new DateTime(mensagem.dtagend);
    modalRef.componentInstance.hrAgendValue = new DateTime(mensagem.hragend);
    modalRef.componentInstance.currencyValue = mensagem.vroportunidade;

    modalRef.result.then((result) => {
      this.mensagemHttpService.getMessage(mensagem.id).subscribe(status => {
        if (status.result.mensagem[0].idstatus !== 1) {
          this.notification.info('Informação','A mensagem já foi enviada não é possível alterar');
          return;
        } else {
          mensagem.mensagem = result.textValue;
          mensagem.dtagend = result.dtAgendValue;
          mensagem.hragend = result.hrAgendValue;
          this.updateTotalOportunidade(mensagem.vroportunidade, result.currencyValue);
          mensagem.vroportunidade = result.currencyValue;
          this.ajustaHoraLimite(mensagem);
          const thinMessage = {id: mensagem.id, mensagem: mensagem.mensagem, dtagend: mensagem.dtagend, hragend: mensagem.hragend, vroportunidade: mensagem.vroportunidade, dtlimite: mensagem.dtlimite, hrlimite: mensagem.hrlimite};
          this.mensagemHttpService.atualizarModalMensagem(thinMessage).subscribe(response => {

            this.notification.success('Informação','Mensagem atualizada com sucesso');
            }, err => {
              this.notification.warning('Atenção', err.error.mensagem);
            }
          )
        }
      })
    }, (reason) => {
    });
  }

  onRowClick($event: any) {
    $event.idstatus === 1 ? this.UpdateMensagem($event) : this.UpdateVrOportunidade($event);
    // this.router.navigate(['detalhe', $event.id], { relativeTo: this.route });
  }

  private prepareLoad() {
    this.loadingMore = true;
    this.mensagens = [];
  }

  setMensagens(consulta: MensagensConsulta) {
    this.prepareLoad();
    this.totalMensagens = consulta.totalMensagens;
    this.totalOportunidades = consulta.totalOportunidades;
    this.totalPages = consulta.totalPages;
    this.mensagens = consulta.mensagens;
    this.updateHrAgendMensagens(consulta.mensagens);
    this.loadingMore = false;
  }

  updateTotalOportunidade(valorOriginal: number, valorAtual: number){
    this.totalOportunidades = (this.totalOportunidades - valorOriginal) + valorAtual;
  }

  getMessagesNotSend() {
    this.mensagemHttpService.getMessagesNotSend(this.filtro).subscribe(response => {
      this.setMensagens(response);
      }, err => {
        this.notification.warning('Atenção', err.error.mensagem);
      }
    )
  }

  getMsgsSend(){
    this.mensagemHttpService.getMsgsSend(this.filtro).subscribe(response => {
      this.setMensagens(response);
      }, err => {
        this.notification.warning('Atenção', err.error.mensagem);
      }
    )
  }

  getMsgsScheduleToday() {
    this.mensagemHttpService.getMsgsScheduleToday(this.filtro).subscribe(response => {
      this.setMensagens(response);
      }, err => {
        this.notification.warning('Atenção', err.error.mensagem);
      }
    )
  }

  getMsgsSendToday(){
    this.mensagemHttpService.getMsgsSendToday(this.filtro).subscribe(response => {
      this.setMensagens(response);
      }, err => {
        this.notification.warning('Atenção', err.error.mensagem);
      }
    )
  }

  getMsgsPendentToday(){
    this.mensagemHttpService.getMsgsPendentToday(this.filtro).subscribe(response => {
      this.setMensagens(response);
      }, err => {
        this.notification.warning('Atenção', err.error.mensagem);
      }
    )
  }

  getMsgsCanceled(){
    this.mensagemHttpService.getMsgsCanceled(this.filtro).subscribe(response => {
      this.setMensagens(response);
      }, err => {
        this.notification.warning('Atenção', err.error.mensagem);
      }
    )
  }

  getMsgsAll(){
    this.mensagemHttpService.getMsgsAll(this.filtro).subscribe(response => {
      this.setMensagens(response);
      }, err => {
        this.notification.warning('Atenção', err.error.mensagem);
      }
    )
  }

  onConsultaMensagem(){
    this.goToPage(1);
    this.onSearchUpdated()
  }

  preventSubmit(event: any): void {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === 'Enter') {
      keyboardEvent.preventDefault();
    }
  }

  preventClickSubmit(event: Event): void {
    event.preventDefault();
  }

  getClass(status: StatusMensagem) {
    switch (status) {
      case StatusMensagem.AguardandoEnvio : {
        return 'mensagem-status aguardando-envio ';
      }
      case StatusMensagem.Enviada: {
        return 'mensagem-status enviada';
      }
      case StatusMensagem.EnvioCanceladoPeloUsuario: {
        return 'mensagem-status envio-cancelado-usuario';
      }
      case StatusMensagem.EnvioCanceladoPeloAdministrado: {
        return 'mensagem-status envio-cancelado-administrador';
      }
    }
  }

  getIconPyramid(mensagem: MensagemGrid) {
    if (mensagem.idstatus == 1) {
      return 'form';
    } else if (mensagem.idstatus == 2) {
      return 'cloud';
    } else if (mensagem.idstatus == 3) {
      return 'close';
    } else if (mensagem.idstatus == 4) {
      return 'close';
    } else {
      return 'form';
    }
  }

  getIconBackground(mensagem: MensagemGrid) {
    if (mensagem.idstatus == 1) {
    return 'bg-gradient-primary d-flex-column-centered';
    } else if (mensagem.idstatus == 2) {
      return 'bg-gradient-success d-flex-column-centered';
    } else if (mensagem.idstatus == 3) {
      return 'bg-gradient-danger d-flex-column-centered';
    } else if (mensagem.idstatus == 4) {
      return 'bg-gradient-danger d-flex-column-centered';
    } else {
      return 'bg-gradient-primary d-flex-column-centered';
    }

  }

  updateHrAgendMensagens(mensagens: MensagemGrid[]) {
    if(mensagens.length === 0) return;
    for (let mensagem of mensagens) {
      mensagem.hragend = new DateTime(Utils.timeToDate(String(mensagem.dtagend), String(mensagem.hragend)));
    }
  }


  getPagesArray(): number[] {
    const pages = [];
    const maxVisiblePages = 3; // 3 páginas centrais visíveis
    let startPage = Math.max(this.currentPage - Math.floor(maxVisiblePages / 2), 1);
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > this.totalPages) {
      endPage = this.totalPages;
      startPage = Math.max(this.totalPages - maxVisiblePages + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  goToPage(page: number): void {
    this.currentPage = page;
    this.onSearchUpdated();
  }

  ajustaHoraLimite(mensagem: MensagemGrid) {
    const UMA_HORA_MS = 60 * 60 * 1000; // Constante para 1 hora em milissegundos
    const horaAgendada  = mensagem.hragend.getHours(); // Obtém a hora de hrLimite
    const dataLimite = new Date(mensagem.dtagend);

    if (horaAgendada  >= 23) {
      // Incrementa o dia de dtAgend se a hora for 23 ou mais
      dataLimite.setDate(dataLimite.getDate() + 1);
    }

    mensagem.dtlimite = dataLimite;
    // Ajusta hrLimite para 1 hora a mais que hrAgend
    mensagem.hrlimite = new Date(mensagem.hragend.getTime() + UMA_HORA_MS);
  }
}
