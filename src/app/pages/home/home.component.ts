import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class HomeComponent implements OnInit {

  cards = [
    { label: 'Catalogue', path: '/catalogue', icon: 'ballot' },
    { label: 'Comparateur', path: '/comparateur', icon: 'compare_arrows' }
  ]

  constructor() { }

  ngOnInit(): void {
  }

}
