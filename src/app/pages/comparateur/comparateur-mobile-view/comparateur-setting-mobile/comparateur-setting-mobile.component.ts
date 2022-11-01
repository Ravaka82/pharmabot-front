import {Component, Input, OnInit} from '@angular/core';
import {CatalogueSettings} from "../../../../@core/interfaces";
import {GET_ITEM_STORAGE} from "../../../../utils";
import {ComparateurService} from "../../../../@core/services/comparateur.service";

@Component({
  selector: 'app-comparateur-setting-mobile',
  templateUrl: './comparateur-setting-mobile.component.html',
  styleUrls: ['./comparateur-setting-mobile.component.scss']
})
export class ComparateurSettingMobileComponent implements OnInit {

  @Input() rows!: CatalogueSettings.CatalogueSettingsPage[];

  TVA = 1.2;
  PV = 1.4;
  isRemise = false;
  isTva = false;

  constructor(private comparateurService: ComparateurService) { }

  ngOnInit(): void {
    this.TVA = GET_ITEM_STORAGE('TVA') || this.TVA;
    this.PV = GET_ITEM_STORAGE('PV') || this.PV;
  }

  toolbarMenuValueChanged(): void {
    this.comparateurService.PV = this.PV;
    this.comparateurService.TVA = this.TVA;
    this.comparateurService.isTva = this.isTva;
    this.comparateurService.isRemise = this.isRemise;
    this.comparateurService.settingChanged();
  }
}
