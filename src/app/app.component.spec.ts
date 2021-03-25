import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-download',
  styles: [''],
  template: '<html></html>'
})
class DownloadComponent {
  @Input() downloadModalData: any;
  @Input() type: string;
}

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        DownloadComponent
      ],
    }).compileComponents();
  }));

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

});
