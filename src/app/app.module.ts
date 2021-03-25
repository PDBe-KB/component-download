import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {
  MatButtonModule, MatDialogModule, MatMenuModule,
  MatRadioModule, MatCheckboxModule, MatTooltipModule
} from '@angular/material';

import { AppComponent } from './app.component';
import {DownloadComponent, DownloadDialog} from './download/download.component';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {DownloadService} from './download/download.service';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';

@NgModule({
  declarations: [
    AppComponent,
    DownloadComponent,
    DownloadDialog
  ],
  imports: [
    BrowserModule,
    NoopAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatMenuModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTooltipModule,
    HttpClientModule,
    FormsModule,
    FlexLayoutModule,
    MatRadioModule,
    MatCheckboxModule,
    MatTooltipModule
  ],
  entryComponents: [DownloadDialog],
  providers: [DownloadService],
  bootstrap: [AppComponent]
})
export class AppModule { }
