import {Component, Input, OnInit} from '@angular/core';

export type iconType = "default" | "outlined" | "two-tone" | "round" | "sharp";

@Component({
  selector: 'material-icon',
  templateUrl: './material-icon.component.html'
})
export class MaterialIconComponent implements OnInit {

  @Input() name!: string | undefined;
  @Input() type: iconType = "default";

  constructor() { }

  ngOnInit(): void {
  }

}
