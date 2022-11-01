import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-catalogue-mobile-view',
  templateUrl: './catalogue-mobile-view.component.html',
  styleUrls: ['./catalogue-mobile-view.component.scss']
})
export class CatalogueMobileViewComponent implements OnInit {

  @Input() rows: any[] = []
  @Output() search = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

}
