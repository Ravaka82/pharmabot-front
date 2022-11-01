import {Directive, ElementRef, EventEmitter, HostListener, Input, Output} from '@angular/core';

@Directive({
  selector: '[yyInputEditable]'
})
export class InputEditableDirective {

  @Input() row:any;
  @Output() keyEnter = new EventEmitter()

  constructor(private el: ElementRef) {
  }

  @HostListener('dblclick') onDblclick() {
    this.row.isEditable = true;
  }

  @HostListener('focusout') onFocusout() {
    this.row.isEditable = false;
  }

  @HostListener('keyup.enter') keyupEnter() {
    this.row.isEditable = false;
    this.keyEnter.next()
  }
}
