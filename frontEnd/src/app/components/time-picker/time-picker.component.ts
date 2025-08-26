import { Component, AfterViewInit, EventEmitter, Input, Output, ElementRef, OnChanges, SimpleChanges } from '@angular/core';
import { DateTime, TempusDominus } from '@eonasdan/tempus-dominus';

@Component({
  selector: 'app-time-picker',
  templateUrl: './time-picker.component.html',
  styleUrls: ['./time-picker.component.scss']
})
export class TimePickerComponent implements AfterViewInit {
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
        this.dateModel = new DateTime(e.detail.date);
        this.dateModelChange.emit(this.dateModel);
      });

      // Initialize picker with current dateModel value
      if (this.dateModel) {
        timePicker.dates.setValue(this.dateModel);
      }
    }
  }
}
