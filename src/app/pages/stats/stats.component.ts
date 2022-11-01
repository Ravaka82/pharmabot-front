import { DatePipe } from "@angular/common";
import { Component,OnInit } from "@angular/core";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { MatRadioChange } from "@angular/material/radio";
import { Router } from "@angular/router";
import { select, Store } from '@ngrx/store';
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
import { Archive, Client, Fournisseur, Stats, StatsCommonName, User } from "src/app/@core/interfaces";
import {ArchiveActions, ClientActions, FournisseurActions, StatsActions, StatsCommonNameActions, UserActions } from "src/app/@core/store/actions";
import { ArchiveSelector, ClientSelector, FournisseurSelector, StatsCommonNameSelector, StatsSelector, UserSelector } from "src/app/@core/store/selectors";
import { takeUntil} from "rxjs/operators";
import { UnsubscribeComponent } from "src/app/shared/component/unsubscribe/unsubscribe.component";

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
  selector: 'app-stats',
  templateUrl: './stats.component.html',
  styleUrls: ['./stats.component.scss']
})
export class StatsComponent implements OnInit {
  loading: boolean = false;
  public chartOptions: Partial<ChartOptions>| any;
  designationForm: FormGroup = {} as FormGroup;
  submitting: boolean = false;
  stats: Stats.Entry[] = [];
  fournisseur: Fournisseur.Entry[] = [];
  user: User.Entry[]=[];
  client: Client.Entry[]=[];
  statsCommonName: StatsCommonName.Entry[] = [];
  archive : Archive.Entry[]=[];
  data:any={};
  type: any;
  someName = [{value:'1',label:'Medicament'},{value:'2',label:'Nom Commun'}];
  series:any[] = [];
  month: string[] = [];
  price: any[] =[];
  countFournisseur :any ;
  countUsers: any;
  countArchive: any;
  countClient: any;
  
  constructor( protected store: Store, private router: Router, private _datePipe: DatePipe){
    
  }
  dateRangeChange(dateRange:HTMLInputElement){
    return dateRange.value;
  }
  dateChangeFormat(value:string, format:string){
    return this._datePipe.transform(value, format);
  }

  initCommonNameForm2(): void {
      this.designationForm = new FormGroup({
          designation: new FormControl('', [Validators.required]),
          medicament: new FormControl('medicament', [Validators.required]),
          nomCommun: new FormControl('nomCommun', [Validators.required]),
          dateStart: new FormControl('', [Validators.required]),
          dateEnd: new FormControl('', [Validators.required]),
    
      });
      this.series =[];
      this.price =[];
      this.month = [];
      console.log("donneee voloany "+this.statsCommonName);

    for (let x=0; x < this.statsCommonName.length; x++) { 
       this.month =  this.month.concat(this.statsCommonName[x].date_catalogue);
    }
    const unique = (value: any, index: any, self: string | any[]) => {
      return self.indexOf(value) === index
    }
    const uniqueMonth = this.month.filter(unique)

    for(let m = 0 ; m< uniqueMonth.length ; m++){
        this.price.push("0");
    }
    const uniqueFournisseur  = [...new Set(this.statsCommonName.map(item => item.fournisseur))];
    
    for(let x = 0 ; x< uniqueFournisseur.length ; x++){
      this.series.push({
        name : uniqueFournisseur[x],
        data: this.price,
      });
    }
    console.log("unique fournisseur :"+ uniqueFournisseur);
    for(let statName of this.statsCommonName){
      this.series = this.series.map((els, key) => {
        if (els.name === statName.fournisseur) {
          let indexMonth = uniqueMonth.findIndex(item => item === statName.date_catalogue);
          let newPrice: any = [...els.data];
          newPrice[indexMonth] = statName.prix;
          //  console.log("donnee "+els );
          for(let i = 1;i<newPrice.length;i++){
            if(newPrice[i-1]!=0){
              newPrice[i] = (newPrice[i-1])
            }
          }
          console.log("donnee faranay "+newPrice );
          return {...els, data: [...newPrice]};
        }
        return els;
      });
    }
    this.chartOptions = {
      chart: {
        type: 'line',
        height: 350
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth",
        width:3
      },
      legend: {
        tooltipHoverFormatter: function(val: string, opts: { w: { globals: { series: { [x: string]: { [x: string]: string; }; }; }; }; seriesIndex: string | number; dataPointIndex: string | number; }) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      series: this.series,
      xaxis: {
        categories:this.month
      },
      yaxis: {
        title: {
          text: this.series
        }
      },
    }
  }
  initDesignationForm(): void {
    this.designationForm = new FormGroup({
      designation: new FormControl('', [Validators.required]),
      medicament: new FormControl('medicament', [Validators.required]),
      nomCommun: new FormControl('nomCommun', [Validators.required]),
      dateStart: new FormControl('', [Validators.required]),
      dateEnd: new FormControl('', [Validators.required]),

    });
    this.series =[];
    this.price =[];
    this.month = [];
    console.log("DONNEE "+this.stats);

    for (let x=0; x < this.stats.length; x++) { 
       this.month =  this.month.concat(this.stats[x].date_catalogue);
    }
    const unique = (value: any, index: any, self: string | any[]) => {
      return self.indexOf(value) === index
    }
    const uniqueMonth = this.month.filter(unique)

    for(let m = 0 ; m< uniqueMonth.length ; m++){
        this.price.push("0");
    }
    const uniqueFournisseur  = [...new Set(this.stats.map(item => item.fournisseur))];
    
    for(let x = 0 ; x< uniqueFournisseur.length ; x++){
      this.series.push({
        name : uniqueFournisseur[x],
        data: this.price,
      });
    }
    console.log("unique fournisseur"+ uniqueFournisseur);
    for(let stat of this.stats){
      this.series = this.series.map((el, key) => {
        if (el.name === stat.fournisseur) {
          let indexMonth = uniqueMonth.findIndex(item => item === stat.date_catalogue);
          let newPrice: any = [...el.data];
          newPrice[indexMonth] = stat.prix;
           console.log(newPrice, el.data);
           for(let i = 1;i<newPrice.length;i++){
            if(newPrice[i-1]!=0){
              newPrice[i] = (newPrice[i-1])
            }
          }
          return {...el, data: [...newPrice]};
        }
        return el;
      });
    }
    this.chartOptions = {
      chart: {
        type: 'line',
        height: 350
      },
      dataLabels: {
        enabled: false
      },
      stroke: {
        curve: "smooth",
        width:3
      },
      legend: {
        tooltipHoverFormatter: function(val: string, opts: { w: { globals: { series: { [x: string]: { [x: string]: string; }; }; }; }; seriesIndex: string | number; dataPointIndex: string | number; }) {
          return (
            val +
            " - <strong>" +
            opts.w.globals.series[opts.seriesIndex][opts.dataPointIndex] +
            "</strong>"
          );
        }
      },
      markers: {
        size: 0,
        hover: {
          sizeOffset: 6
        }
      },
      series: this.series,
      xaxis: {
        categories:this.month
      },
      yaxis: {
        title: {
          text: this.series
        }
      },
    }
  }
    ngOnInit(): void {
      this.store.select(StatsCommonNameSelector.selectAll)
      .subscribe(statsCommonName => {
        this.statsCommonName=statsCommonName;
        this.initCommonNameForm2();
    })
      this.store.select(StatsSelector.selectAll)
      .subscribe(stats => {
        this.stats=stats;
        this.initDesignationForm();
     })
     this.store.dispatch(FournisseurActions.LOAD_REQUESTED());

    this.store.select(FournisseurSelector.selectAll)
    .subscribe(fournisseur => {
      this.fournisseur = fournisseur;
      this.countFournisseur = this.fournisseur.length;
    
    console.log("deed"+this.countFournisseur)
    });
    this.store.dispatch(UserActions.LOAD_REQUESTED());

    this.store.select(UserSelector.selectAll)
    .subscribe(user => {
      this.user = user;
      this.countUsers = this.user.length;
    
    console.log("deedsss"+this.countUsers)
    });
    this.store.dispatch(ClientActions.LOAD_REQUESTED());

    this.store.select(ClientSelector.selectAll)
    .subscribe(client => {
      this.client = client;
      this.countClient = this.client.length;
    
    console.log("deedsss"+this.countClient)
    });
    this.store.select(ArchiveSelector.selectAll)
    .subscribe(archive => {
      this.archive = archive;
      this.countArchive = this.archive.length;
    
    console.log("deedsss"+this.countArchive)
    });
 }

     onChange(event: MatRadioChange) {
      this.type= event.value;
      console.log(this.type);
    }
    onSubmit() {
      this.series =[];
      this.price =[];
      this.month = [];
      const designation = this.designationForm.get("designation")?.value;
      const commonName = this.designationForm.get("designation")?.value;
      console.log(this.dateChangeFormat(this.designationForm.get('dateStart')?.value,"MM/dd/yyyy"));
      console.log(this.dateChangeFormat(this.designationForm.get('dateEnd')?.value,"MM/dd/yyyy"));
      const dateStart = this.designationForm.get("dateStart")?.value;
      const dateEnd = this.designationForm.get("dateEnd")?.value;
  
      if(this.type == 1){
        console.log(this.type);
        this.store.dispatch(StatsActions.LOAD_REQUESTED_DESIGNATION({
        designation,dateStart,dateEnd
        }))
        this.store.select(StatsSelector.selectAll)
        .subscribe(stats => {
          this.stats=stats;
        })
      }
      else  if(this.type == 2){
        this.series=[];
        this.price=[];
        this.month=[];
        this.store.dispatch(StatsCommonNameActions.LOAD_REQUESTED_COMMON_NAME({
          commonName,dateStart,dateEnd
        }))
      }
    }
  }

