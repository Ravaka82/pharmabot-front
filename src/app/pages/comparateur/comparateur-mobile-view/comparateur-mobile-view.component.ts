import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {CatalogueSettings} from "../../../@core/interfaces";

@Component({
  selector: 'app-comparateur-mobile-view',
  templateUrl: './comparateur-mobile-view.component.html',
  styleUrls: ['./comparateur-mobile-view.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ComparateurMobileViewComponent implements OnInit {

  @Input() settings!: CatalogueSettings.CatalogueSettingsPage[];

  constructor() { }

  ngOnInit(): void {
  }

}
