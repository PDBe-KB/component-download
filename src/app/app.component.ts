import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  data: any;
  type: string;

  constructor() {
    this.data = {
      'count': 13,
      'accession': 'P0DTC2',
      'listPdbIds': [
        '7cak',
        '7kl9',
        '7dk3',
        '7k8y',
        '7d0b',
        '7jwb',
        '7cn9',
        '7nd6',
        '6zgh',
        '7dd8',
        '7kxj',
        '7dk7',
        '7dk5'
      ],
      'relationship': 'protvistaProtein'
    };
    this.type = 'summary';
  }
}
