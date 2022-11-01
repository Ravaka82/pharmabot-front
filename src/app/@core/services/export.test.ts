const XLSX = require('xlsx-js-style');

const data = [
  {
    "cart_count": 3,
    "cart_total": 97650,
    "designation": "LAMISIL 1% CREME T/15G AFR",
    "fournisseurName": "SOMAPHAR",
    "date_expiration": "5/31/23",
    "prix": 32550
  },
  {
    "cart_count": 1,
    "cart_total": 32560,
    "designation": "LAMISIL 1% CREME - TUBE 15GR",
    "fournisseurName": "PHARMALIFE",
    "date_expiration": "05/2023",
    "prix": 32560
  },
  {
    "cart_count": 2,
    "cart_total": 247660,
    "designation": "LAMISIL 250MG CPR - BOITE 14 CPR",
    "fournisseurName": "PHARMALIFE",
    "date_expiration": "03/2023",
    "prix": 123830
  }
];

const dto: any = data.map(row => {
  return [
    row.fournisseurName,
    row.designation,
    row.date_expiration,
    row.cart_count,
    row.prix,
    row.cart_total
  ]
})

const header = [ 'Fournisseur', 'Designation' , 'Date de peremption', 'Quantité', 'Prix', 'Total'].map(v => {
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

dto.unshift(header);

const workbook = XLSX.utils.book_new();
const ws = XLSX.utils.aoa_to_sheet(dto, {cellStyles: true})

XLSX.utils.book_append_sheet(workbook, ws, "Pharmabot")
ws["!cols"] = [
  { width: 20 },
  { width: 70 },
  { width: 20 },
  { width: 10 },
  { width: 10 },
  { width: 10 },
];

XLSX.writeFile(workbook, 'test.xlsx' , {});
