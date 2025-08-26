import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

@Pipe({
  name: 'timeMask'
})
export class TimeMaskPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    return moment(value, 'HH:mm').format('HH:mm');
  }


}
