PDBe-KB Download Component
=

[![Build Status](https://www.travis-ci.com/PDBe-KB/component-download.svg?branch=main)](https://www.travis-ci.com/PDBe-KB/component-download)
[![codecov](https://codecov.io/gh/PDBe-KB/component-download/branch/main/graph/badge.svg?token=4493EGB4A3)](https://codecov.io/gh/PDBe-KB/component-download)
[![Maintainability](https://api.codeclimate.com/v1/badges/0ea50de6bcc06953d8f4/maintainability)](https://codeclimate.com/github/PDBe-KB/component-download/maintainability)

This repository is for the codebase of a lightweight Angular v6.1 web component that provides download functionality for coordinate files, validation reports and sequences.

The web component is used on PDBe-KB Aggregated Views of Proteins to provide download options for coordinate files, sequences and validation reports.
### Example:

<img src="https://raw.githubusercontent.com/PDBe-KB/component-download/main/pdbe-kb-download-component.png">

## Quick Start

Get the code and install dependencies
```
git clone https://github.com/PDBe-KB/component-download.git
cd component-download
npm i
```

Running the app
```
ng serve
```

Running tests
```
ng test
```

## Dependencies

The main template (i.e. `index.html` by default) should also have the following CSS imports:
```angular2html
<link rel="stylesheet" href="https://ebi.emblstatic.net/web_guidelines/EBI-Framework/v1.3/css/ebi-global.css" type="text/css" media="all"/>
<link rel="stylesheet" href="https://ebi.emblstatic.net/web_guidelines/EBI-Icon-fonts/v1.3/fonts.css" type="text/css" media="all"/>
<link rel="stylesheet" href="https://ebi.emblstatic.net/web_guidelines/EBI-Framework/v1.3/css/theme-pdbe-green.css" type="text/css" media="all"/>
```

## Basic usage

The component can be added to any Angular v7 apps.

#### 1.) Import the component:

Import the component in `app.module.ts` by default.
```
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
```

#### 2.) Add the component to a template:
```angular2html
<app-download [downloadModalData]="data" [type]="type"></app-download>
```

##### Example input data
```angular2html
{
  'accession':'P00001',
  'listPdbIds': [
    '1cbs'
  ],
  'type': 'similarProteins'
}
```

## Versioning

We use [SemVer](http://semver.org/) for versioning. For the versions available, see the [tags on this repository](https://github.com/PDBe-KB/component-download-component/tags).

## Authors

* **Nurul Nadzirin** - *Initial work* - [nurulnad](https://github.com/nurulnad)
* **Mihaly Varadi** - *Migrating to GitHub* - [mvaradi](https://github.com/mvaradi)

See also the list of [contributors](https://github.com/PDBe-KB/component-download-component/contributors) who participated in this project.

## License

This project is licensed under the EMBL-EBI License - see the [LICENSE](LICENSE) file for details

## Acknowledgements

We would like to thank the [PDBe team](https://www.pdbe.org) and the [PDBe-KB partner resources](https://github.com/PDBe-KB/pdbe-kb-manual/wiki/PDBe-KB-Annotations) for their feedback and contributions.
