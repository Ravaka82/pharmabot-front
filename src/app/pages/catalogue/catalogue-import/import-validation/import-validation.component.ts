import {Component, Input, ViewChild, ViewEncapsulation} from '@angular/core';
import {ColumnMode, DatatableComponent, TableColumn} from "@swimlane/ngx-datatable";

@Component({
  selector: 'app-import-validation',
  templateUrl: './import-validation.component.html',
  styleUrls: ['./import-validation.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImportValidationComponent {

  ColumnMode = ColumnMode;
  rowData: any[] = [];

  @Input() set rows(value: any[]) {
    this.rowData = value;
    this.rowData = [...this.rowData];
  }

  columns: TableColumn[] = [
    { prop: 'designation', name: 'Designation', width: 300 },
    { prop: 'prix', name: 'Prix unitaire'},
    { prop: 'date_expiration', name: 'Date expiration'},
    { prop: 'tva', name: 'TVA' }
  ];

  @ViewChild('table', {static: true}) table: DatatableComponent | undefined;

  constructor() {
  }

}
