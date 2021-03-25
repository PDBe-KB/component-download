import {Component, Inject, Input} from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {DownloadService} from './download.service';

@Component({
  selector: 'app-download',
  templateUrl: './download.component.html',
  styleUrls: ['./download.component.css']
})
export class DownloadComponent  {
  @Input() downloadModalData: any;
  @Input() type: string;
  msConfig: any;
  fdsConfig: any;

  constructor(public dialog: MatDialog) {}

  openDialog(): void {

    this.getFdsConfig();

    const dialogRef = this.dialog.open(DownloadDialog, {
      width: '500px',
      data: {
        accession: this.downloadModalData.accession,
        pdbIds: this.downloadModalData.listPdbIds,
        fdsConfig: this.fdsConfig,
        relationship: this.getRelationship(
          this.downloadModalData.relationship, this.downloadModalData.count),
      }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  getRelationship(iconType, count) {
    var s = (count > 1) ? ('s') : ('');
    let topText = {
      'protvistaProtein': 'mapped to',
      'similarProtein': `mapped to ${count} protein${s} similar to`,
      'ligandsProtein': `containing ${count} ligand${s} for`,
      'interactionsProtein': `mapped to ${count} protein${s} that interact with`,
      'ligands': 'bound to',
      'interactions': 'with instances of',
    };
    if (iconType in topText) {
      return topText[iconType];
    }
    return ':';
  }

  getMsConfig(): void {
    let queries = [];
    for (let i in this.downloadModalData.listPdbIds) {
      queries.push({
        'entryId': this.downloadModalData.listPdbIds[i],
        'query': 'full'
      });
    }
    this.msConfig = {
      'queries': queries,
      'encoding': 'cif',
      'asTarGz': true
    };
  }

  getFdsConfig(): void {
    this.fdsConfig = {
      'ids': this.downloadModalData.listPdbIds
    };
  }
}

@Component({
  selector: 'download-dialog',
  templateUrl: 'download-dialog.html',
  styleUrls: ['download-dialog.css']
})
export class DownloadDialog {

  public errorText: any;
  public isLoading: boolean;
  public noPdbId: boolean;
  public blobData: Blob;
  public hashedurl: string;
  public formats = ['PDBx/mmCIF', 'PDB'];
  chosenformat: string;
  fdstype: string;

  constructor(
    public dialogRef: MatDialogRef<DownloadDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private downloadService: DownloadService
  ) {
    this.noPdbId = false;
    this.chosenformat = 'updated';
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClick(): void {
    this.checkPdbIds();
    this.setCorrectDownloadParams();
    this.isLoading = true;
    this.postFile();
  }

  checkPdbIds(): void {
    if (this.data.pdbIds.length < 1) {
      this.noPdbId = true;
      console.log('There is no pdbId in the data given.');
      // Currently do nothing. In the future grey out modal if no PdbId.
    }
  }

  setCorrectDownloadParams(): void {
    if (this.chosenformat === 'archive-mmCIF') {
      this.data.fdsConfig['data_format'] = 'cif';
      this.fdstype = 'archive';
    } else if (this.chosenformat === 'archive-PDB') {
      this.data.fdsConfig['data_format'] = 'pdb';
      this.fdstype = 'archive';
    } else if (this.chosenformat === 'updated') {
      this.fdstype = 'updated';
    } else if (this.chosenformat === 'fasta-combined') {
      this.fdstype = 'sequences';
      this.data.fdsConfig['combined'] = true;
    } else if (this.chosenformat === 'fasta-individual') {
      this.fdstype = 'sequences';
      this.data.fdsConfig['combined'] = false;
    } else if (this.chosenformat === 'validation') {
      this.fdstype = 'validation-data';
    }
  }

  postFile(): void {
    this.downloadService.postFileDownloadServer(this.fdstype, this.data.fdsConfig).subscribe(
      response => {
        this.hashedurl = response['url'].replace('http:', 'https:');
        this.getFile();
      },
      err => {
        this.isLoading = false;
        this.errorText = err;
      }
    );
  }

  getFile(): void {
    this.downloadService.getFileDownloadServer(this.hashedurl).subscribe(
      response2 => {
        if (response2.status === '200') {
          setTimeout(() => {

            this.downloadFile(response2.body, `${this.data.accession}_${this.chosenformat}.tar.gz`, 'application/tar+gzip');
            this.isLoading = false;
          }, 1000);

        } else if (response2.status === '202') { //json
          setTimeout(() => {
            this.getFile();
          }, 500); // delay by 500 ms every time request is re-made
        } else {
          this.isLoading = false;
          this.errorText = `Error: The download server returns non 200/202 status: ${response2.status}`;
        }
      },
      err2 => {
        this.isLoading = false;
        this.errorText = err2;
      }
    );
  }

  // This is copied from csv-exporter
  downloadFile(content, fileName, mimeType) {
    const a = document.createElement('a');
    mimeType = mimeType || 'application/octet-stream';

    if (navigator.msSaveBlob) { // IE10
      navigator.msSaveBlob(new Blob([content], {
        type: mimeType
      }), fileName);
    } else if (URL && 'download' in a) { // html5 A[download]
      a.href = URL.createObjectURL(new Blob([content], {
        type: mimeType
      }));
      a.setAttribute('download', fileName);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
    }
  }

}
