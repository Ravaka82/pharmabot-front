import { Component, OnInit, ViewChild } from "@angular/core";
import { UnsubscribeComponent } from "src/app/shared/component/unsubscribe/unsubscribe.component";
import { ColumnMode, DatatableComponent, SelectionType, TableColumn} from "@swimlane/ngx-datatable";
import { Search, SearchGraph } from "src/app/@core/interfaces";
import { EntriesSearch } from "src/app/utils";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { DateAdapter } from "@angular/material/core";
import { select, Store } from "@ngrx/store";
import { SearchGraphSelector, SearchSelector } from "src/app/@core/store/selectors";
import { map as _map} from 'lodash';
import { takeUntil} from "rxjs/operators";
import { DatePipe } from "@angular/common";
import { SearchActions, SearchGraphActions } from "src/app/@core/store/actions";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import {
  ApexAxisChartSeries,
  ApexChart,
  ApexDataLabels,
  ApexPlotOptions,
  ApexYAxis,
  ApexLegend,
  ApexStroke,
  ApexXAxis,
  ApexFill,
  ApexTooltip
} from "ng-apexcharts";
import ApexCharts from "apexcharts";
import { MatSelectChange } from "@angular/material/select";
export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart; 
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  yaxis: ApexYAxis;
  xaxis: ApexXAxis;
  fill: ApexFill;
  tooltip: ApexTooltip;
  stroke: ApexStroke;
  legend: ApexLegend;
};

@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss']
})
export class AnalyticsComponent extends UnsubscribeComponent implements OnInit {
  public chartOptions: Partial<ChartOptions>| any;
  ColumnMode = ColumnMode;
  SelectionType = SelectionType;
  rows: Search.Entry[] = [];
  searchGraph: SearchGraph.Entry[]=[];
  itemDelete!: any;
  columns: TableColumn[] = [];
  loading: boolean = false;
  isDeleting: boolean = false;
  selected!: Search.Entry;
  bulkSelected: string[] = [];
  searchRows!: EntriesSearch<any>;
  searchValue: string = '';
  series:any[] = [];
  month: string[] = [];
  price: any[] =[];
  submitting: boolean = false;
  monthForm: FormGroup = {} as FormGroup;
  count: any[] =[];
   uniqueKeyword :any[] =[];
  type: any;
  someName = [{value:'5',label:'limit 5'},{value:'10',label:'limit 10'},{value:'15',label:'limit 15'},{value:'20',label:'limit 20'},{value:'25',label:'limit 25'}];
  @ViewChild('table', {static: true}) table !: DatatableComponent;
 

  constructor
  (
   private _adapter: DateAdapter<any>,
   protected store: Store,
  ) {
    super();
    this._adapter.setLocale('fr')
  }
   
  initCommonNameForm2(): void {
    console.log("donneee voloany "+this.searchGraph.length);

  for (let x=0; x < this.searchGraph.length; x++) { 
     this.month =  this.month.concat(this.searchGraph[x].at);
  }
  const unique = (value: any, index: any, self: string | any[]) => {
    return self.indexOf(value) === index
  }
  const uniqueMonth = this.month.filter(unique)

  for(let m = 0 ; m<uniqueMonth.length ; m++){
      this.price.push("0");
  }
  this.uniqueKeyword  = [...new Set(this.searchGraph.map(item => item.keyword))];


  for(let y of this.searchGraph){
  this.count.push(y['count'])
  }

  console.log("keyword"+this.uniqueKeyword);
  console.log("count"+this.count);
  this.chartOptions={
    series: [{
    data: this.count
  }],
    chart: {
    type: 'bar',
    height: 350,
  
  },
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: true,
    }
  },
  dataLabels: {
    enabled: false
  },
  xaxis: {
    categories:this.uniqueKeyword,
  }
   };
  // var chart = new ApexCharts(document.querySelector("#chart"),this.chartOptions );
  // chart.render();

 }
   ngOnInit():void{
    this.monthForm = new FormGroup({
      mois: new FormControl('', [Validators.required])
    });
    this.store.dispatch(SearchActions.LOAD_REQUESTED());
    this.store.pipe(
      takeUntil(super.unsubscribe()),
      select(SearchSelector.selectAll)
    ).subscribe(rows => {
      this.rows = rows;
      this.searchRows = new EntriesSearch([...this.rows]).setColumns(['_id','count']);
    });
    this.submitting = true;
    this.store.select(SearchGraphSelector.selectAll)
    .subscribe( searchGraph => {
      this.searchGraph =  searchGraph;
      console.log(this.searchGraph)
      this.initCommonNameForm2()
      this.submitting = false;
   });
  }
  onSearch(value: string): void {
    this.rows = this.searchRows.search(value);
    this.searchValue = value;
  }

  onSelect(event: any): void {
    const {selected} = event;
    const elements = [...selected];
    this.bulkSelected = _map(elements, '_id')
  } 
  changeRatio(event: MatSelectChange) {  
    this.type= event.value;
    console.log(this.type);
  }

  onSubmit(){ 
    this.count=[];
    this.uniqueKeyword=[]
    const month:string = this.monthForm.get("mois")?.value;
    this.submitting = true;
    const nombre =this.type;
    this.store.dispatch(SearchGraphActions.LOAD_REQUESTED({
      month,nombre}))
      this.submitting = true;
    this.store.select(SearchGraphSelector.selectAll)
    .subscribe( searchGraph => {
      this.searchGraph =  searchGraph;
       });
   
  }
}