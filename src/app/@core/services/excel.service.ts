import * as XLSX from 'xlsx';
import {set as _set} from 'lodash';
import {Injectable} from "@angular/core";
import {WorkSheet} from "xlsx";

export interface XlsxOptions {
  sheetName: string,
  sheetOption: {
    designation: string,
    prix: string,
    date_expiration: string,
    tva?: string,
  }
}

@Injectable({
  providedIn: 'root'
})
export class ExcelService {

  public options: XlsxOptions = {} as XlsxOptions;

  constructor() {
  }

  readExcel(filepath: string): any {
    const {sheetName} = this.options;
    let workbook = XLSX.readFile(filepath);
    return (sheetName && workbook.Sheets[sheetName] || []);
  }

  getUsedColumns(ws: XLSX.WorkSheet): string[] {
    const availableColumn = [];
    if (ws) {
      for (const key of Object.keys(ws)) {
        if (key.match(/^[a-zA-Z]+/g)) {
          const letterColumn = (key.match(/[^0-9]/g) as string[])[0];
          if (availableColumn.indexOf(letterColumn) < 0) {
            availableColumn.push(letterColumn);
          }
        }
      }
      return availableColumn.sort().sort((a, b) => {
        return a.length < b.length ? -1 : 1;
      });
    }
    return []
  }

  reverseMapping(obj: object): Object {
    const newObj: any = {};
    if (typeof obj === 'object') {
      for (const [key, value] of Object.entries(obj)) {
        if (value) {
          newObj[value] = key;
        }
      }
    }
    return newObj
  }

  buildDTO(ws: WorkSheet): any[] {
    const allColumns = this.getUsedColumns(ws);
    const col: any = this.reverseMapping(this.options.sheetOption);
    const res = {};

    if (ws) {
      for (const [key, value] of Object.entries(ws)) {
        const firstKey = key.charAt(0);
        let v = (value as any).w;

        if (allColumns.indexOf(firstKey) > -1) {
          const columnLetter = (key.match(/[^0-9]/g) as string[])[0];
          const row: number = Number((key.match(/[0-9]+/g) as string[])[0]);

          switch(col[columnLetter]) {
            case 'prix':
              v = (value as any).v;
              break
            default:
              v = v && v.replace(/\s+/g, ' ').trim();
              break
          }

          if (col[columnLetter]) {
            _set(res, [row, col[columnLetter]], v);
          }
        }
      }
    }

    return (Object.values(res) as any)
      .filter((row: any) =>
        typeof row.designation === 'string' &&
        typeof row.prix === 'number'
      );
  }
}

