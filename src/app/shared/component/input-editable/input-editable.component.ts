import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-input-editable',
  templateUrl: './input-editable.component.html',
  styleUrls: ['./input-editable.component.scss']
})
export class InputEditableComponent implements OnInit {

  @Input() row: any;
  @Input() key: string = '';
  @Input() type: string = 'text';

  @Input() step: number = 0;
  @Input() max: number = 100;
  @Input() min: number = 0;

  @Output() valueChange = new EventEmitter()

  constructor() {
  }

  ngOnInit(): void {
  }

}
