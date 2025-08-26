import { Utils } from '../../utils/utils';
import { AfterViewInit, Directive, ViewContainerRef } from "@angular/core";

@Directive({
  selector: '[appContatoFinder]'
})

export class ContatoFinderDirective implements AfterViewInit {

  private lastDigit: string;
  private textBox: HTMLInputElement;
  private docMask = ['999.999.999-99', '99.999.999/9999-99'];

  constructor(private viewContainer: ViewContainerRef) {
  }

  private _cpfMode = true;

  set cpfMode(value: boolean) {
    if (this._cpfMode !== value && value === false && this.lastDigit) {
      this.textBox.value = Utils.removeMascara(this.textBox.value) + this.lastDigit;
    }

    this._cpfMode = value;
  }

  static isNumeric(value: any) {
    return /^-?\d+$/.test(value);
  }

  static isOnCpfMode(text: string) {
    for (let i = 0; i < text.length; i++) {
      const char = text.charAt(i);
      if (char) {
        if (char !== '.' && char !== '-' && char !== '/' && !ContatoFinderDirective.isNumeric(char)) {
          return false;
        }
      }
    }

    return true;
  }

  ngAfterViewInit(): void {
    this.textBox = this.viewContainer.element.nativeElement as HTMLInputElement;
    this.textBox.oninput = ev => {
      this.lastDigit = (ev as any).data;
      this.cpfMode = ContatoFinderDirective.isOnCpfMode(this.textBox.value.toString());
      const text = this.textBox.value.toString();

      if (this._cpfMode === true) {
        if (this.textBox.value.length > this.docMask[0].length) {
          this.textBox.value = text;
        } else {
          this.textBox.value = text;
        }
      }
    };
  }
}
