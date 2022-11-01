import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Observable, of} from "rxjs";
import {select, Store} from "@ngrx/store";
import {takeUntil} from "rxjs/operators";
import {FournisseurSelector} from "../../@core/store/selectors";
import {UnsubscribeComponent} from "../../shared/component/unsubscribe/unsubscribe.component";

@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class FournisseurComponent extends UnsubscribeComponent implements OnInit {
  loading$: Observable<boolean> = of(false);

  constructor(protected store: Store) {
    super();
  }

  ngOnInit(): void {
    this.loading$ = this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(FournisseurSelector.selectLoading)
    )
  }
}
