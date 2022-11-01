import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Subject} from "rxjs";
import {UnsubscribeComponent} from "../unsubscribe/unsubscribe.component";
import {debounceTime, distinctUntilChanged, map, takeUntil} from "rxjs/operators";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent extends UnsubscribeComponent implements OnInit {

  @Output() search = new EventEmitter();
  @Output() keyCode = new EventEmitter();
  keyUp = new Subject<KeyboardEvent>();

  constructor() {
    super();
  }

  ngOnInit(): void {
    this.keyUp
      .pipe(
        takeUntil(super.unsubscribe()),
        map((event: any) => {
          return event.target.value || ''
        }),
        debounceTime(1000),
        distinctUntilChanged()
      ).subscribe(keyword => this.search.emit(keyword))
  }

}
