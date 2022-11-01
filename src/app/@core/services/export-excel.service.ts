import {Injectable} from "@angular/core";
import XLSX from 'xlsx-js-style';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  header = ['Fournisseur', 'Designation' , 'Date de peremption', 'Quantité', 'Prix', 'Total'];

  constructor() {}

  async export(rows: any[]): Promise<void> {
    const workbook = XLSX.utils.book_new();
    const data = this.dataToArray(rows);
    data.unshift(this.getHeader());

    const ws = XLSX.utils.aoa_to_sheet(data, {cellStyles: true});
    XLSX.utils.book_append_sheet(workbook, ws, "Pharmabot");

    ws["!cols"] = [
      { width: 20 },
      { width: 70 },
      { width: 20 },
      { width: 10 },
      { width: 10 },
      { width: 10 },
    ];
    XLSX.writeFile(workbook, `commande-${moment().format('YYYY-MM-DD-hhmm')}.xlsx` , {});
  }

  dataToArray(rows: any[]): any[] {
    return rows.map(row => {
      return [
        row.fournisseurName,
        row.designation,
        row.date_expiration,
        row.cart_count,
        row.prix,
        row.cart_total
      ]
    })
  }

  getHeader(): any[] {
    return this.header.map(v => {
      return {
        v,
        t: 's',
        s: {
          font: { bold: true, color: { rgb: "FFFFFF"} },
          fill: {
            type: 'pattern',
            patternType: 'solid',
            fgColor: {
              rgb: "10172a"
            }
          }
        }
      }
    })
  }
}
