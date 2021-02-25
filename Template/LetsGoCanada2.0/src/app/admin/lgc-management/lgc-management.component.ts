import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges, Input } from '@angular/core';
import { NgModel } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { MatSelectChange } from '@angular/material';
import { Agency } from 'src/app/models/agency';
import { Router } from '@angular/router';
import { showNotification } from 'src/app/toast-message/toast-message';

declare const $: any;

@Component({
  selector: 'app-agency-management',
  templateUrl: './lgc-management.component.html',
  styleUrls: ['./lgc-management.component.css']
})

export class LgcManagementComponent implements OnInit {
  fileToUpload: File = null;

  constructor(private agencyService: GeneralService, private router: Router) { }

  ngOnInit() {
  }


  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
    this.fileUpload();
  }

  fileUpload() {
    let url: string = '/admin/imageLoginfileUpload';

    const formData = new FormData();
    formData.append('file', this.fileToUpload);
    this.agencyService.postFile(url, formData).subscribe(
      (res) => {
        if (res.message == 'Ok') {
          showNotification('top', 'right', 'success', 'The document was saved successfully.');
        }
      },
      (err) => {
        showNotification('top', 'right', 'danger', err.error.message);
      }
    )
  }
}