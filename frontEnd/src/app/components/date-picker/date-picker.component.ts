import { Component, AfterViewInit, EventEmitter, Input, Output, ElementRef } from '@angular/core';
import { DateTime, TempusDominus } from '@eonasdan/tempus-dominus';

@Component({
  selector: 'app-date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss']
})
export class DatePickerComponent implements AfterViewInit {
  @Input() dateModel: DateTime;
  @Input() label: string = "";
  @Input() inputName: string = "";
  @Input() isDisabled: boolean = false;
  @Output() dateModelChange = new EventEmitter<DateTime>();

  constructor(private el: ElementRef) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    const element = document.getElementById(this.inputName);
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
        this.dateModel = new DateTime(e.detail.date);
        this.dateModelChange.emit(this.dateModel);
      });

      if (this.dateModel) {
        datePicker.dates.setValue(this.dateModel);
      }
    }
  }
}
