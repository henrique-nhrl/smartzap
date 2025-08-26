import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-calculador',
  templateUrl: './calculador.component.html',
  styleUrls: ['./calculador.component.scss']
})
export class CalculadorComponent {
  @Output() valorChange = new EventEmitter<{ valor:number, unidade: string }>();


  calculoValor = 0;
  valores: number[] = [];
  calculoUnidade = 'meses';

  constructor() {
    this.onUnidadeChange(this.calculoUnidade); // Inicializa com os valores padrão
  }

  onUnidadeChange(unidade: string) {
    this.calculoUnidade = unidade;
    if (unidade === 'meses') {
      this.valores = Array.from({ length: 13 }, (_, i) => i); // 0 a 12
    } else if (unidade === 'dias') {
      this.valores = Array.from({ length: 31 }, (_, i) => i); // 0 a 30
    }
    this.calculoValor = 0; // Reseta o valor selecionado ao trocar de unidade
  }

  onValorChange(event: Event) {
    const selectElement = event.target as HTMLSelectElement;
    const valorSelecionado = Number(selectElement.value);

    // Emite o valor para o componente pai
    this.valorChange.emit({ valor: valorSelecionado, unidade: this.calculoUnidade });
  }

}
