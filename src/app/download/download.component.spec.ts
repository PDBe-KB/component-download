import { Observable, of, throwError } from 'rxjs';
import { Injectable, Injector } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatRadioModule } from '@angular/material';
import { FormsModule } from '@angular/forms';
import { DownloadComponent, DownloadDialog } from './download.component';
import { DownloadService } from './download.service';
import 'rxjs/add/observable/empty';
import 'rxjs/add/observable/from';

let stubPdbids = ['1cbs','1tqn'];

let stubdownloadModalData = {
  'accession':'P00001',
  'listPdbIds': stubPdbids,
  'type': 'similarProteins'
}
  
let stubQueries = [ 
  {"entryId": '1cbs', "query": "full" },
  {"entryId": '1tqn', "query": "full" }]

let stubMsConfig = {
  "queries": stubQueries,
  "encoding": "cif",
  "asTarGz": true
}

let stubMatDialogData = {
  accession: 'P09876',
  pdbIds: ['1cbs'],
  msConfig: stubMsConfig,
  relationship: " "
}

// Create a MatDialog mock class 
export class MatDialogMock {
  // When the component calls this.dialog.open(...) we'll return an object
  // with an afterClosed method that allows to subscribe to the dialog result observable.
  close() { return null };
  open() { return { afterClosed: () => of({action: true}) };
  }
}

describe('DownloadComponent', () => {
  let component: DownloadComponent;
  let fixture: ComponentFixture<DownloadComponent>;
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadComponent ],
      imports: [ MatDialogModule, FormsModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: stubMatDialogData },
        { provide: MatDialog, useClass: MatDialogMock }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownloadComponent);
    component = fixture.componentInstance;
    component.downloadModalData = stubdownloadModalData;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open dialog', () => {
    const returnedVal = {
      afterClosed: () => of({action: true})
    };
    spyOn(component['dialog'], 'open').and.returnValue(returnedVal);
    component.openDialog();
    expect(component['dialog'].open).toHaveBeenCalled();
  });

  it('should build msConfig', () => {
    component.getMsConfig();
    expect(component.msConfig.queries).toEqual(stubQueries);
  });

});

@Injectable()
class HttpRequestInterceptorMock implements HttpInterceptor {
  constructor(private injector: Injector) {}
    intercept(request: HttpRequest<any>, next: HttpHandler): 
      Observable<HttpEvent<any>> {
        if (request.url == "mock-real-url") {
          return of(new HttpResponse({ status: 200,  body:new Blob([],{type:'application/gzip'})}));
        }
        else if (request.url == "mock-real-url-202") {
          return of(new HttpResponse({ status: 202,  body:new Blob([],{type:'application/gzip'})}));
        }
        else if (request.url == "mock-404-url") {
          return of(new HttpResponse({ status: 404,  body:{}}));

        }
        else if(request.url == "mock-err-url") {
          return throwError({ error: 'error' });
        }
        else if(request.url.includes("mock-real-post-url")) {
          return of(new HttpResponse({ status: 200,  body:{ "url": "mock-real-url" }}));
        }
        else if(request.url.includes("mock-real-post-url-202")) {
          return of(new HttpResponse({ status: 202,  body:{ "url": "mock-real-url-202" }}));
        }
        else if (request.method == "GET") {
          return of(new HttpResponse({ status: 200,  body:new Blob([],{type:'application/gzip'})}));
        }
    }
}

describe('DownloadDialog', () => {
  let component: DownloadDialog;
  let fixture: ComponentFixture<DownloadDialog>;
  let service: DownloadService;
  let httpTestingController: HttpTestingController;
  let blobReturned = [new Blob(["randomBlob"],{type:'application/tar+gzip'})];
  const postReturned = {url: 'somefakeUrl'};
  const getReturnedJson = { "message": "Warning: The file you are trying to download is not ready yet." };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownloadDialog ],
      imports: [ MatDialogModule, MatRadioModule, FormsModule, HttpClientTestingModule],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: stubMatDialogData },
        { provide: MatDialogRef, useClass: MatDialogMock },
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpRequestInterceptorMock,
          multi: true
        }
      ]
    })
    .compileComponents();
  }));
  beforeEach(() => {
    // We inject our service (which imports the HttpClient) and the Test Controller
    httpTestingController = TestBed.get(HttpTestingController);
    fixture = TestBed.createComponent(DownloadDialog);
    component = fixture.componentInstance;
    service = new DownloadService(null);
    fixture.detectChanges();
  });
  afterEach(() => {
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check PdbIds', () => {
    component.data.pdbIds = [];
    component.checkPdbIds();
    expect(component.noPdbId).toBeTruthy();
  })

  //it('should send POST ModelServer and receive a blob data', () => {
  //  spyOn(service,'postModelServer').and.callFake(() => {
  //    return Observable.from([blobReturned])
  //  })
  //  service.postModelServer(stubMsConfig).subscribe(response => {
  //    expect(response).toEqual(blobReturned)
  //  });
  //})

  it('should close the dialog when click Close button', () => {
    let spy = spyOn(component.dialogRef, 'close').and.callThrough();
    component.onNoClick();
    expect(spy).toHaveBeenCalled();
  });

  it('should set the correct download parameters', () => {
    component.data.fdsConfig = {
      "ids": ['1cbs']
    }
    let formats = {
      "archive-mmCIF" : "archive",
      "validation" : "validation-data",
      "archive-PDB" : "archive",
      "updated": "updated",
      "fasta-combined" : "sequences",
      "fasta-individual" : "sequences"
    }
    for (let key in formats) {
      component.chosenformat = key;
      component.setCorrectDownloadParams();
      expect(component.fdstype).toEqual(formats[key])
    }
  })

  //it('should send POST DownloadFileService and receive a fake url data', () => {
  //  spyOn(service,'postFileDownloadServer').and.callFake(() => {
  //    return Observable.from([postReturned])
  //  })
  //  service.postFileDownloadServer(component.fdstype,component.data.fdsConfig).subscribe(response => {
  //    expect(response).toEqual(postReturned)
  //  });
  //})
  //
  //it('should send GET DownloadFileService and receive a fake json', () => {
  //  spyOn(service,'getFileDownloadServer').and.callFake(() => {
  //    return Observable.from([getReturnedJson])
  //  })
  //  service.getFileDownloadServer(component.hashedurl).subscribe(response => {
  //    expect(response).toEqual(getReturnedJson)
  //  }); 
  //});

  it('should set anchor upon downloadFile', () => {
    // create spy object with a click() method
    const spyObj = jasmine.createSpyObj('a', ['click']);
    // spy on document.createElement() and return the spy object
    spyOn(document, 'createElement').and.returnValue(spyObj);
    component.downloadFile(blobReturned,'test.tar.gz',"application/tar+gzip");
    expect(document.createElement).toHaveBeenCalledTimes(1);
    expect(document.createElement).toHaveBeenCalledWith('a');
  });

  //it('should return blob gunzip', () => {
  //  component.hashedurl = "mock-real-url";
  //  component.getFile();
  //  expect(component.isLoading).toBeFalsy;
  //});

  it('should return GET with status 404', () => {
    component.hashedurl = "mock-404-url";
    component.getFile();
    expect(component.errorText).toContain('Error');;
  });

  it('should return GET error', () => {
    component.hashedurl = "mock-err-url";
    component.getFile();
    expect(component.errorText).toContain('Error');;
  });

  it('should return POST and GET success with status 200', () => {
    component.fdstype = "mock-real-post-url";
    component.data.fdsConfig = {
      "ids": ['1cbs']
    }
    component.postFile();
    expect(component.errorText).toBeFalsy;;
  });

  it('should return POST and GET success with status 202', () => {
    component.fdstype = "mock-real-post-url-202";
    component.data.fdsConfig = {
      "ids": ['1cbs']
    }
    component.postFile();
    expect(component.errorText).toBeFalsy;;
  });

  it('should return POST error', () => {
    component.fdstype = "mock-err-post-url";
    component.data.fdsConfig = {
      "ids": ['1cbs']
    }
    component.postFile();
    expect(component.errorText).toContain('Error');
  })
});
