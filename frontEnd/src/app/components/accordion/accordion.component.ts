import {Component, Input} from '@angular/core';

@Component({
  selector: 'ng-accordion',
  templateUrl: './accordion.component.html',
  styleUrls: ['./accordion.component.scss'],

})
export class AccordionComponent {
  @Input() expanded: boolean;
  @Input() innerHtml: string;
  @Input() bigSize = false;

  constructor() {
  }
}
