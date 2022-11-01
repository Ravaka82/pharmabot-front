import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {takeUntil} from "rxjs/operators";
import {select, Store} from "@ngrx/store";
import {RoleSelector} from "../../@core/store/selectors";
import {UnsubscribeComponent} from "../../shared/component/unsubscribe/unsubscribe.component";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class RolesComponent extends UnsubscribeComponent implements OnInit {

  loading$: Observable<boolean> = of(false);

  constructor(protected store: Store) {
    super();
  }

  ngOnInit(): void {
    this.loading$ = this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(RoleSelector.selectLoading)
    )
  }

}
