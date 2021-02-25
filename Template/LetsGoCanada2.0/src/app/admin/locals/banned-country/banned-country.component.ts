
import { Component, OnInit, Output, Input, ViewChild } from '@angular/core';

import { ConfigTable } from 'src/app/models/configTable';
import { showNotification } from 'src/app/toast-message/toast-message';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { ComunicationService } from 'src/app/services/comunication.service';
import { MatOption, MatSelect } from '@angular/material';

declare const $: any;
interface BannedCountryDTO {
  Id: number;
  schoolId: number;
  countryId?: number;
  countryList?: number[];
  country?: {
    name?: string;
  };
  school?: {
    name?: string;
  }
}

@Component({
  selector: 'app-banned-country',
  templateUrl: './banned-country.component.html',
  styleUrls: ['./banned-country.component.css']
})
export class BannedCountryComponent implements OnInit {

  bannedForm = new FormGroup({
    schoolId: new FormControl('', Validators.required),
    countryId: new FormControl('', Validators.required)
  });

  postObject = {
    "schoolId": 0,
    "countryId": 0
  }

  public configTable: ConfigTable = {
    url: '/Admin/getBannedCountryList',
    headerRow: ['School', 'Country', 'Actions'],
    columnsName: ['school.name', 'country.name', 'delete'],
    hasEditAction: true,
    request: 'post',
    objRequest: this.postObject,
    tableTitle: "Banned Country List"
  };

  public countries: string[];
  public schools: string[];
  public schoolName: string;
  private allSelected = false;
  public loading = false;

  @ViewChild('coutrySelect') skillSel: MatSelect;
  @Input() bannedCountryList: any[];

  @ViewChild('banForm') formValues;
  private bannedList: Array<BannedCountryDTO> = [];


  constructor(private service: GeneralService, private comunication: ComunicationService) { }

  ngOnInit() {
    this.getCountry();
    this.getSchool();

    this.getBannedCountryList();

  }
  /**
  * @author Deivid Mafra;
  * @date 09/24/2020;
  * @remarks This method is responsible for selecting/unselecting all countries in the dropdown list.
  */
  toggleAllSelection = () => {
    this.allSelected = !this.allSelected;  // to control select-unselect

    if (this.allSelected) {
      this.skillSel.options.forEach((item: MatOption) => item.select());
    } else {
      this.skillSel.options.forEach((item: MatOption) => { item.deselect() });
    }
    this.skillSel.close();

  }

  /**
  * @author Deivid Mafra;
  * @date 07/19/2020;
  * @remarks This method returns the countries list.
  */
  getCountry = () => {
    let url = "/School/getGeoList";
    this.service.getService(url).subscribe(
      res => {
        this.countries = res.data.country;
      },
      err => {
        console.log(err);
      }
    )
  }

  /**
  * @author Deivid Mafra;
  * @date 07/19/2020;
  * @remarks This method returns the school list.
  */
  getSchool = () => {
    let url: string = "/School/getSchoolList";
    this.service.post(url, this.postObject).subscribe(
      res => {
        this.schools = res.data;

      },
      err => {
        console.log(err);
      }
    )
  }

  /**
  * @author Deivid Mafra;
  * @date 07/25/2020;
  */
  onSubmit = () => {
    this.loading = true;

    let url: string = '/Admin/setBannedCountry';

    let countryIdList = this.bannedForm.get('countryId').value.filter(value => value != 0);

    let bannedCountry: BannedCountryDTO = {
      "Id": 0,
      "schoolId": this.bannedForm.get('schoolId').value,
      "countryList": countryIdList,
    };

    let isRegistered: BannedCountryDTO[] = [];

    for (let i = 0; i < bannedCountry.countryList.length; i++) {
      let ruleRegistered = this.bannedList.find((b) => b.schoolId == bannedCountry.schoolId && b.countryId == bannedCountry.countryList[i]);
      if (ruleRegistered) {
        isRegistered.push(ruleRegistered);
      }
    }

    console.log('isRegistered OUT', isRegistered);

    if (isRegistered.length > 0) {

      for (let i = 0; i < isRegistered.length; i++) {
        showNotification('top', 'right', 'danger', isRegistered[i].school.name + ' is already banned for ' + isRegistered[i].country.name + '. Please unselect ' + isRegistered[i].country.name + ' and try again.');
      }

      return;
    } else {
      this.service.post(url, bannedCountry).subscribe(
        res => {

          if (res.message == 'Ok') {
            this.comunication.sendProcess(res);
            this.formValues.resetForm();
            this.clearForm();
            showNotification('top', 'right', 'success', 'New rule registered successfully!');
            this.getBannedCountryList();
            this.loading = false;
          }
        },
        err => {
          console.log(err);
          showNotification('top', 'right', 'danger', err);
        }
      )
    }

  }

  /**
  * @author Deivid Mafra;
  * @date 07/24/2020;
  */
  deleteBannedCountry = bannedCountry => {
    let url: string = '/Admin/deleteBannedCountry';

    let bannedCountryId = {
      "id": bannedCountry.id
    }

    this.service.post(url, bannedCountryId).subscribe(
      res => {
        if (res.message == 'Ok') {
          this.comunication.sendProcess(res);
          this.getBannedCountryList();
          showNotification('top', 'right', 'success', 'Register deleted successfully!');

        }
        err => {
          console.log(err);
          showNotification('top', 'right', 'danger', err);
        }
      }
    )
  }


  clearForm() {
    $("mat-form-field").removeClass('mat-form-field-invalid');
    $('mat-select').removeClass('mat-select-invalid');
  }

  getBannedCountryList = () => {
    this.service.post(this.configTable.url, this.postObject).subscribe(
      res => {
        this.bannedList = res.data;
      },
      error => {
        console.log(error);
      }
    )
  }


}
