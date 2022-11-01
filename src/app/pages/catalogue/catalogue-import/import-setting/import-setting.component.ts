import {
  AfterViewInit,
  Component,
  Input,
  OnChanges,
  OnInit, Output,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewEncapsulation,
  EventEmitter
} from '@angular/core';
import {ColumnMode, DatatableComponent, TableColumn} from "@swimlane/ngx-datatable";
import {WorkBook} from "xlsx";
import {ExcelService} from "../../../../@core/services/excel.service";

@Component({
  selector: 'app-import-setting',
  templateUrl: './import-setting.component.html',
  styleUrls: ['./import-setting.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ImportSettingComponent implements OnInit, AfterViewInit, OnChanges {
  ColumnMode = ColumnMode;
  rows: any = [
    {
      designation: '',
      prix: '',
      date_expiration: '',
      tva: ''
    },
  ];
  columnListDefault: string[] = []
  columnList: string[] = []
  columns: TableColumn[] = [];
  previewData: any = [];
  itemDrag: any = null;
  itemDragType: 'fromTable' | 'fromSheet' = 'fromTable';
  conf: any = {};

  @Input() workbook: WorkBook = {} as WorkBook;
  @Input() sheetName: string = '';
  @Input() savedParams: any;
  @Output() configChange = new EventEmitter()

  @ViewChild('table', {static: true}) table: DatatableComponent | undefined;
  @ViewChild('templateSelect') templateSelect: TemplateRef<any> | undefined;

  constructor(private excelService: ExcelService) {
  }

  ngOnInit() {
    this.conf = this.rows[0];
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.workbook && this.sheetName) {
      const ws = this.workbook.Sheets[this.sheetName];
      this.columnList = this.excelService.getUsedColumns(ws);
      this.columnListDefault = [...this.columnList];
      this.excelService.options = {
        sheetName: this.sheetName,
        sheetOption: this.rows[0]
      }
    }
    if (changes?.savedParams?.currentValue) {
      const columns = Object.values(this.savedParams);
      this.rows[0] = {
        designation: this.savedParams.designation,
        prix: this.savedParams.prix,
        date_expiration: this.savedParams.date_expiration,
        tva: this.savedParams.tva
      }
      this.rows = [...this.rows];
      this.columnList = this.columnList.filter(col => columns.indexOf(col) < 0);
      this.updateConf(this.savedParams);
    }
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.columns = [
        { prop: 'designation', name: 'Designation', cellTemplate: this.templateSelect },
        { prop: 'prix', name: 'Prix unitaire', cellTemplate: this.templateSelect },
        { prop: 'date_expiration', name: 'Date expiration', cellTemplate: this.templateSelect},
        { prop: 'tva', name: 'TVA', cellTemplate: this.templateSelect}
      ]
    })
  }

  updateConf(payload: any = null): void {
    const { designation, prix, date_expiration, tva } = payload || this.table?.rows[0];
    this.configChange.emit({designation, prix, date_expiration, tva});
    this.conf =  { designation, prix, date_expiration, tva };
    const ws = this.workbook.Sheets[this.sheetName];
    this.excelService.options.sheetOption = this.conf;
    this.previewData = this.excelService.buildDTO(ws);
  }

  dropped(event: any, column: any): void {
   // console.log(`Column ${this.itemDrag} => ${column.prop}`);
    const rowMapReverse: any = this.excelService.reverseMapping(this.rows[0]);

   if (this.itemDragType === 'fromSheet') {
     this.rows[0] = {
       ...this.rows[0],
       [column.prop]: this.itemDrag
     }
   }

    if (this.itemDragType === 'fromTable') {
      const old = rowMapReverse[this.itemDrag];
      this.rows[0] = {
        ...this.rows[0],
        [column.prop]: this.itemDrag,
        [old]: this.rows[0][column.prop]
      }
    }

    const rowListValues: any = Object.values(this.rows[0]);
    this.columnList = [...this.columnListDefault];

    for(const col of rowListValues) {
      if (this.columnListDefault.indexOf(col) > -1) {
        const index = this.columnList.findIndex(column => column === col);
        this.columnList.splice(index, 1);
      }
    }


   this.rows = [...this.rows];
   this.itemDrag = null;
   this.updateConf();
  }

}
