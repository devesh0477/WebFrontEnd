import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { Province } from 'src/app/models/province';
import { City } from 'src/app/models/city';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { showNotification } from 'src/app/toast-message/toast-message';
import { Country } from 'src/app/models/country';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-city-edit',
  templateUrl: './city-edit.component.html',
  styleUrls: ['./city-edit.component.css']
})
export class CityEditComponent implements OnInit {

  constructor(private cityService: GeneralService) { }

  @Input() cityToEdit: City;
  @Input() provinces: Array<Province>;
  @Input() countries: Array<Country>;
  @Input() cities: Array<City>;
  @Output() newCityList: EventEmitter<Array<City>> = new EventEmitter();

  tempProv;

  cityForm = new FormGroup({
    countryId: new FormControl(""), //just to filter, not sending anything ...
    cityId: new FormControl(null, Validators.required), //only for send to database
    provinceId: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required)
  });

  ngOnInit() {
  }

  ngOnChanges() {
    // console.log(">>>", this.cityToEdit)
    if (this.cityToEdit)
      this.fillForm();
  }

  fillForm() {
    this.cityForm.get('cityId').setValue(this.cityToEdit.cityId);
    this.cityForm.get('provinceId').setValue(this.cityToEdit.provinceId);
    this.cityForm.get('name').setValue(this.cityToEdit.name);
  }

  /**
   * @author Deivid Mafra;
   * @date 02/16/2020;
   * @remarks This method is responsible for submit the data from the form to the end-point creating or updating a City
   */
  onSubmit() {
    if (!this.cityForm.get('name').value || !this.cityForm.get('provinceId').value) {
      showNotification('top', 'right', 'warning', 'Please fill all form fields.');
    } else {

      var data: City;
      let url: string = '/admin/setCity';

      if (typeof this.cityForm.get('cityId').value === undefined || this.cityForm.get('cityId').value == null) {
        data = {
          "cityId": 0,
          "provinceId": this.cityForm.get('provinceId').value,
          "name": this.cityForm.get('name').value
        }

        let registered = this.cities.some(city => city.name.toLowerCase() === this.cityForm.get('name').value.toLowerCase());

        if (registered) {
          showNotification('top', 'right', 'danger', 'City already registered.');
        } else {
          this.cityService.post(url, data).subscribe(
            (res) => {
              if (res.message == 'Ok') {
                this.cities.unshift(res.data[0]);
                this.newCityList.emit(this.cities);
                this.clearField();
                showNotification('top', 'right', 'success', 'City registered successfully!');
              }
              (err) => {
                console.log(err)
                showNotification('top', 'right', 'danger', 'Error trying to register the new city!');
              }
            }
          )
        }
      } else {
        data = this.cityForm.value;

        let index: number = this.cities.findIndex((cities: any) => cities.cityId === this.cityForm.get('cityId').value);
        // console.log("***", index);

        this.cityService.post(url, data).subscribe(
          (res) => {
            if (res.message == 'Ok') {
              this.cities[index] = res.data[0];
              this.newCityList.emit(this.cities);
              this.clearField();
              showNotification('top', 'right', 'success', 'City updated successfully!');
            }
            (err) => {
              console.log(err)
              showNotification('top', 'right', 'danger', 'Error trying to register the new city!');
            }
          }
        )
      }
    }
  }

  clearField() {
    this.cityForm.reset();
    this.cityForm.get('countryId').setValue("");
    // console.log(">>>>>>", this.cityForm.value);
    console.log('this.tempProv', this.tempProv)
    if (this.tempProv) {
      this.provinces = this.tempProv;
    }
    console.log('this.provinces', this.provinces)
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

}