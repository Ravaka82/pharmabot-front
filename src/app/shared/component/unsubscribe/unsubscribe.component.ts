import {Subject} from 'rxjs';
import {Component, OnDestroy} from '@angular/core';

@Component({
  template: ''
})
export class UnsubscribeComponent implements OnDestroy {
  private readonly _unsubscribe: Subject<any>;

  constructor() {
    this._unsubscribe = new Subject<any>();
  }

  ngOnDestroy(): void {
    this._unsubscribe.next();
    this._unsubscribe.complete();
    console.log('UNSUBSCRIBE.')
  }

  public unsubscribe(): Subject<any> {
    return this._unsubscribe
  }
}
