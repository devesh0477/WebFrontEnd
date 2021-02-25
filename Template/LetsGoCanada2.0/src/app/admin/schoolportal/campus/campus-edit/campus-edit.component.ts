import { GeneralService } from './../../../../services/general.service';
import { City } from './../../../../models/city';
import { Country } from './../../../../models/country';
import { Campus } from 'src/app/models/campus';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Province } from 'src/app/models/province';
import { showNotification } from 'src/app/toast-message/toast-message';
import { ActivatedRoute } from '@angular/router';
import { MatSelectChange } from '@angular/material';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-campus-edit',
  templateUrl: './campus-edit.component.html',
  styleUrls: ['./campus-edit.component.css']
})
export class CampusEditComponent implements OnInit {

  campusForm = new FormGroup({
    campusId: new FormControl(null),
    schoolId: new FormControl(null),
    campusName: new FormControl('', Validators.required),
    address: new FormControl('', Validators.required),
    postalcode: new FormControl('', Validators.required),
    contacMail: new FormControl('', [Validators.required, Validators.email]),
    countryId: new FormControl(null, Validators.required),
    provinceId: new FormControl(null, Validators.required),
    cityId: new FormControl(null, Validators.required),
    about: new FormControl(''),
  });

  @Input() campusToEdit: Campus;
  @Input() campuses: Array<Campus>;
  @Input() countries: Country;
  @Input() provinces: Array<Province>;
  @Input() cities: Array<City>;

  @Output() newCampusesList: EventEmitter<Array<Campus>> = new EventEmitter();

  tempProv;
  tempCity;
  public whosWorking: string = '';

  constructor(private campusService: GeneralService, private route: ActivatedRoute) { }

  ngOnInit() {
  }

  ngOnChanges() {
    // console.log(">>>", this.campusToEdit)
    if (this.campusToEdit)
      this.fillForm();
  }

  fillForm() {
    this.campusForm.get('campusId').setValue(this.campusToEdit.campusId);
    this.campusForm.get('schoolId').setValue(this.campusToEdit.schoolId);
    this.campusForm.get('campusName').setValue(this.campusToEdit.campusName)
    this.campusForm.get('address').setValue(this.campusToEdit.address)
    this.campusForm.get('postalcode').setValue(this.campusToEdit.postalcode)
    this.campusForm.get('contacMail').setValue(this.campusToEdit.contacMail)
    this.campusForm.get('countryId').setValue(this.campusToEdit.countryId)
    this.campusForm.get('provinceId').setValue(this.campusToEdit.provinceId)
    this.campusForm.get('cityId').setValue(this.campusToEdit.cityId)
    this.campusForm.get('about').setValue(this.campusToEdit.about)
  }

  /**
   * Method to define the accion to show the spinner.
   * @param paramet 
   * @author Diego.Perez
   * @date 12/14/2020
   */
  onPopUpDoing(paramet: string) {
    if (!isNullOrUndefined(paramet) && paramet == this.whosWorking) {
      return true;
    } else {
      return false;
    }
  }

  /**
 * @author Deivid Mafra;
 * @date 06/8/2020;
 * @remarks This method is responsible for submit the data from the form to the end-point creating or updating a Campus
 */
  onSubmit() {
    if (!this.campusForm.valid) {
      showNotification('top', 'right', 'warning', 'Please check all form fields in red.');
    } else {

      var data: Campus;
      let url: string = '/school/postCampus';
      this.whosWorking = 'submit';
      if (typeof this.campusForm.get('campusId').value === undefined || this.campusForm.get('campusId').value == null) {
        data = {
          "campusId": 0,
          "schoolId": this.route.snapshot.paramMap.get('id'),
          "campusName": this.campusForm.get('campusName').value,
          "about": this.campusForm.get('about').value,
          "cityId": this.campusForm.get('cityId').value,
          "provinceId": this.campusForm.get('provinceId').value,
          "countryId": this.campusForm.get('countryId').value,
          "address": this.campusForm.get('address').value,
          "postalcode": this.campusForm.get('postalcode').value,
          "contacMail": this.campusForm.get('contacMail').value,
        }

        let registered = this.campuses.some(campus => campus.campusName.toLowerCase() === this.campusForm.get('campusName').value.toLowerCase());
        
        if (registered) {
          showNotification('top', 'right', 'danger', 'Campus already registered.');
          this.whosWorking = '';
        } else {
          
          this.campusService.post(url, data).subscribe(
            (res) => {
              if (res.message == 'Ok') {
                showNotification('top', 'right', 'success', 'Campus registered successfully!');
                this.campuses.unshift(res.data[0]);
                this.newCampusesList.emit(this.campuses);
                this.clearField();
              }
              (err) => {
                console.log(err)
                showNotification('top', 'right', 'danger', 'Error trying to register the new campus!');
              }
              this.whosWorking = '';
            }
          )
        }
      } else {
        data = this.campusForm.value;
        console.log('data', data)

        let index: number = this.campuses.findIndex((campuses: Campus) => campuses.campusId === this.campusForm.get('campusId').value);
        console.log("***", index);

        this.campusService.post(url, data).subscribe(
          (res) => {
            if (res.message == 'Ok') {
              showNotification('top', 'right', 'success', 'Campus updated successfully!');
              this.campuses[index] = res.data[0];
              this.newCampusesList.emit(this.campuses);
              this.clearField();
              this.whosWorking = '';
            }
            (err) => {
              console.log(err)
              showNotification('top', 'right', 'danger', 'Error trying to register the new campus!');
              this.whosWorking = '';
            }
          }
        )
      }
    }
  }

  clearField() {
    this.campusForm.reset();
    console.log(">>>>>>", this.campusForm.value);
  }

  selectCountryChange(event: MatSelectChange) {
    if (this.tempProv) {
      this.provinces = this.tempProv;
    }

    if (this.provinces !== undefined) {
      this.tempProv = this.provinces;
      console.log('this.tempProv', this.tempProv)
      this.provinces = this.provinces.filter(provinceList => provinceList.countryId == <any>event);
      // console.log('this.searchForm.value', this.searchForm.value);
    }
  }

  selectProvinceChange(event: MatSelectChange) {
    if (this.tempCity) {
      this.cities = this.tempCity;
    }

    if (this.cities !== undefined) {
      this.tempCity = this.cities;
      console.log('this.tempCity', this.tempCity)
      this.cities = this.cities.filter(cityList => cityList.provinceId == <any>event);
      // console.log('this.searchForm.value', this.searchForm.value);
    }
  }

}
