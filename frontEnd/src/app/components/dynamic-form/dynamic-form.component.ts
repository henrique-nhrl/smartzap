import { Utils } from './../../utils/utils';
import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

interface CampoForm {
  Nome: string;
  Tipo: string;
  ItensCombo?: string[];
}

@Component({
  selector: 'app-dynamic-form',
  templateUrl: './dynamic-form.component.html',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnInit {
  @Input() campos: CampoForm[] = [];
  @Input() texto: string = '';
  dynamicForm: FormGroup;
  textFormated: string = '';
  validFormDynamic: boolean = true;

  constructor(private fb: FormBuilder, public activeModal: NgbActiveModal) {
    this.dynamicForm = this.fb.group({});
   }

  ngOnInit(): void {
    this.campos.forEach(campo => {
      switch(campo.Tipo) {
        case 'etEdit':
          this.dynamicForm.addControl(campo.Nome, this.fb.control('', Validators.required));
          break;
        case 'etTimePicker':
          this.dynamicForm.addControl(campo.Nome, this.fb.control(new Date(), Validators.required));
          break;
        case 'etCombo':
          this.dynamicForm.addControl(campo.Nome, this.fb.control('', Validators.required));
          break;
      }
    });
  }

  onSubmit() {
    this.validFormDynamic = this.dynamicForm.valid;
    this.textFormated = this.formatText(this.dynamicForm.value);
    this.activeModal.close(this.textFormated);
  }

  formatText(formValues: any): string {
    let text = this.texto;
    for (let campo of this.campos) {
      switch (campo.Tipo) {
        case 'etEdit':
          text = text.replace('&' + campo.Nome + '&', formValues[campo.Nome]);
          break;
        case 'etTimePicker':
          text = text.replace('@' + campo.Nome + '@', Utils.formatDate(String(formValues[campo.Nome])));
          break;
        case 'etCombo':
          const itensComboStr = '[' + campo.ItensCombo?.join(',') + ']';
          text = text.replace('|' + campo.Nome + itensComboStr + '|', formValues[campo.Nome]);
          break;
      }
    }
    return text;
  }


}
