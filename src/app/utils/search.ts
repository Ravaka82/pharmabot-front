import { v4 as uuidv4 } from 'uuid';
import {set as _set, get as _get} from 'lodash';

export class EntriesSearch<T> {
  private indexedRows: any[] = [];
  private rowMap: any = {};
  private rowMapKeys: any = {};
  private readonly rows: T[] = [];
  private columns: string[] = [];

  constructor(entries: T[]){
    this.rows = entries;
  }

  private indexRows(): void {
    this.indexedRows = [];
    this.rowMap = {};
    this.rowMapKeys = {};
    let index = 0;
    for (const row of this.rows as any) {
      const id = uuidv4();
      for (const column of this.columns) {
        _set(this.rowMap, [index], row[column]);
        this.indexedRows.push(id)
        index++;
      }
      _set(this.rowMapKeys, [id], {...row, uuid: id});
    }
  }

  setColumns(columns: string[]) {
    this.columns = columns;
    this.indexRows();
    return this;
  }

  search(key: string) {
    if (this.columns.length === 0) { return [] }
    const resultMap = {};
    for (const [index, entry ] of Object.entries(this.rowMap) as any) {
      const keys = key.split(' ');
      const resultKeys: any = [];
      for (const k of keys) {
        resultKeys.push(entry.toLowerCase().indexOf(k.toLowerCase()) > -1)
      }
      const found = resultKeys.reduce((a: any, b: any) => a && b);
      if (found) {
        const result = _get(this.rowMapKeys, [this.indexedRows[index]]);
        _set(resultMap, [result.uuid], result);
      }
    }
    return Object.values(resultMap) as T[];
  }
}
