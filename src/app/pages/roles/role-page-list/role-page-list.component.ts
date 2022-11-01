import {Component, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {ColumnMode, TableColumn} from "@swimlane/ngx-datatable";
import {DatePipe} from "@angular/common";
import {MatDialog} from "@angular/material/dialog";
import {DateAdapter} from "@angular/material/core";
import {Role} from "../../../@core/interfaces";
import {UnsubscribeComponent} from "../../../shared/component/unsubscribe/unsubscribe.component";
import {select, Store} from "@ngrx/store";
import {RoleSelector} from "../../../@core/store/selectors";
import {takeUntil} from "rxjs/operators";
import {RoleActions} from "../../../@core/store/actions";

@Component({
  selector: 'app-role-page-list',
  templateUrl: './role-page-list.component.html',
  styleUrls: ['./role-page-list.component.scss']
})
export class RolePageListComponent extends UnsubscribeComponent implements OnInit {
  selectedRole!: Role.Entry;
  ColumnMode = ColumnMode;
  rows = [
    {
      page: 'Accueil',
      path: '/accueil',
      checked: false
    },
    {
      page: 'Catalogue',
      path: '/catalogue',
      checked: false
    },
    {
      page: 'Comparateur',
      path: '/comparateur',
      checked: false
    },
    {
      page: 'Facturation',
      path: '/facturation',
      checked: false
    },
    {
      page: 'Panier',
      path: '/panier',
      checked: false
    },
    {
      page: 'Utilisateurs',
      path: '/utilisateurs',
      checked: false
    },
    {
      page: 'Fournisseur',
      path: '/fournisseurs',
      checked: false
    },
    {
      page: 'Clients',
      path: '/clients',
      checked: false
    },
    {
      page: 'Gestion catalogue',
      path: '/gestion-catalogue',
      checked: false
    },
    {
      page: 'Rôle',
      path: '/roles',
      checked: false
    },
    {
      page: 'Historique',
      path: '/historiques',
      checked: false
    },
    {
      page: 'Chat',
      path: '/chat',
      checked: false
    },
    {
      page: 'Promotions',
      path: '/promotions',
      checked: false
    },
    {
      page: 'Annuaires',
      path: '/annuaires',
      checked: false
    },
    {
      page: 'Stats',
      path: '/stats',
      checked: false
    },
    {
      page: 'Map',
      path: '/map',
      checked: false
    },
    {
      page: 'Etl',
      path: '/etl',
      checked: false
    },
    {
      page: 'References-xts',
      path: '/references-xts',
      checked: false
    },
    {
      page: 'analytics',
      path: '/analytics',
      checked: false
    }
  ];
  columns: TableColumn[] = [];

  @ViewChild('pageTemplate', {static: true}) pageTemplate: TemplateRef<any> | undefined;
  @ViewChild('authorizeTemplate', {static: true}) authorizeTemplate: TemplateRef<any> | undefined;

  constructor(
    private _datePipe: DatePipe,
    private modalRef: MatDialog,
    private _adapter: DateAdapter<any>,
    protected store: Store
  ) {
    super();
    this._adapter.setLocale('fr')
  }

  dblClick(): void {
    throw new Error('Method not implemented.');
  }
  focusout(): void {
    throw new Error('Method not implemented.');
  }
  keypressEnter(): void {
    throw new Error('Method not implemented.');
  }

  ngOnInit(): void {
    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(RoleSelector.selectedRole)
    ).subscribe(role => {
      this.selectedRole = role;
      this.rows = this.rows.map(row => {
        return {
          ...row,
          checked: role.pages?.indexOf(row.path) > -1,
          disabled: !role._id
        }
      });
      this.rows = [...this.rows];
    })
    this.columns = [
      { name: 'Page', cellTemplate: this.pageTemplate, width: 300 },
      { name: 'Autorisé', cellTemplate: this.authorizeTemplate }
    ];
  }

  update(row: any, checked: boolean): void {
    row.checked = checked;
    const pages = this.rows.filter(row => row.checked).map(p => p.path);
    this.store.dispatch(RoleActions.UPDATE_REQUESTED({
      id: this.selectedRole?._id,
      changes: { pages }
    }))
  }
}
