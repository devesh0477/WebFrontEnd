import { GeneralService } from './../../../services/general.service';
import { Component, OnInit } from '@angular/core';
import { saveAs } from 'file-saver';
import { showNotification } from 'src/app/toast-message/toast-message';

export interface Student {
  Id: number;
  type: string;
  level: number;
  digitSize: number;
  numberOfDigits: number;
  speed: number;
  numberOfQuestions: number;
  subtraction: number;
  dividentSize: number;
}

@Component({
  selector: 'app-payment-csv',
  templateUrl: './payment-csv.component.html',
  styleUrls: ['./payment-csv.component.css']
})
export class PaymentCsvComponent implements OnInit {
  public hasFile: boolean = false;
  public tableHeader: string[] = ["ApplicationCostID", "ProgramID", "ConceptID", "Amount", "visible", "Deleted", "ConceptName", "ProgramName", "SchoolName"];
  private fileData: File;
  public pageOfItems = [];
  public showSpinner: boolean = false;
  public programResource: boolean = true; // only for spinner control
  public programPrice: boolean = true; // only for spinner control

  constructor(private csvService: GeneralService) { }

  ngOnInit() {
  }

  getProgramCostResources = () => {
    this.programResource = false; // only for spinner control
    let url: string = '/DataAdmin/getProgramCostResources';
    this.csvService.getDownloadCsv(url).subscribe(
      res => {
        this.programResource = Boolean(res); // only for spinner control
        new saveAs(res, 'ReferenceData.csv');
      },
      err => {
        console.log('err', err);
      }
    )

  }

  getProgramPrices = () => {
    this.programPrice = false; // only for spinner control
    let url: string = '/DataAdmin/getProgramPrices'
    this.csvService.getDownloadCsv(url).subscribe(
      res => {
        this.programPrice = Boolean(res); // only for spinner control
        new saveAs(res, 'ApplicationCosts.csv');
      },
      err => {
        console.log('err', err);
      }
    )
  }

  postProgramPrices = () => {
    this.showSpinner = true;
    let url: string = '/DataAdmin/postProgramPrices'

    const formData = new FormData();
    formData.append('file', this.fileData, this.fileData.name);

    this.csvService.postFile(url, formData).subscribe(
      res => {

        if (res.message == 'Ok') {
          showNotification('top', 'right', 'success', 'Program prices created Successfully!');
          this.showSpinner = false;
        }
      },
      err => {
        console.log('err', err)
      }
    )

  }

  uploadCsv = csvFile => {
    this.hasFile = false;
    this.fileData = <File>csvFile.target.files[0];
    // console.log('this.fileData:', this.fileData)
    this.showDataFromCSV();
  }

  showDataFromCSV() {
    this.pageOfItems = [];

    if (this.fileData) {

      if (this.fileData.type !== 'application/vnd.ms-excel') {
        showNotification('top', 'right', 'danger', 'Please select a .CSV file!');

      } else {
        var reader = new FileReader();
        reader.readAsText(this.fileData);
        reader.onload = (e) => {
          // console.log(reader.result);
          const fileCsv: string = reader.result as string;
          const fileRows = fileCsv.split('\n');

          // this.tableHeader = fileRows[0].split(','); // giving me error on last column ["SchoolName\r "]

          for (let i = 1; i < fileRows.length - 1; i++) {
            var row = {}; // create a new row
            var cell = fileRows[i].split(','); // split the row in the file in cells by comma

            for (let j = 0; j < this.tableHeader.length; j++) {
              row[this.tableHeader[j]] = cell[j];
            }

            this.pageOfItems.push(row);

          }

          this.hasFile = true;
        }

      }
    }
  }

}
