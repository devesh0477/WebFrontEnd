import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { City } from 'src/app/models/city';
import { FormGroup, FormControl } from '@angular/forms';
import { Province } from 'src/app/models/province';
import { Country } from 'src/app/models/country';
import { MatSelectChange } from '@angular/material';

@Component({
  selector: 'app-city-search',
  templateUrl: './city-search.component.html',
  styleUrls: ['./city-search.component.css']
})
export class CitySearchComponent implements OnInit {

  @Input() cities: Array<City>;
  @Input() provinces: Array<Province>;
  @Input() searchProvince: Array<Province>;
  @Input() countries: Array<Country>;
  @Output() newSearch: EventEmitter<String> = new EventEmitter();

  public countrySize;

  searchForm = new FormGroup({
    countryId: new FormControl(''),
    provinceId: new FormControl(''),
    name: new FormControl(''),
  });

  public btnDisable: boolean = false;

  constructor() { }

  ngOnInit() {
  }

  search() {
    this.newSearch.emit(this.searchForm.value);
    // console.log("Search string>>>", this.searchForm.value);
  }

  clearField() {
    this.searchForm.reset();
    this.searchForm.get('provinceId').setValue("");
    this.searchForm.get('name').setValue("");
    // console.log(">>>>>>", this.searchForm.value);
    this.newSearch.emit(this.searchForm.value); // reset the form list
    this.searchProvince = this.provinces; //reset province dropdown list
    this.countrySize = undefined;
    this.btnDisable = false;
  }

  selectCountryChange(event: MatSelectChange) {
    if (this.searchForm.get('provinceId').value === "" && this.searchForm.get('name').value === "") {
      this.btnDisable = true;
      // console.log('true', this.searchForm.value)
    } else {
      this.btnDisable = false;
      // console.log('false', this.searchForm.value)
    }

    if (this.provinces !== undefined) {
      this.searchProvince = this.provinces.filter(provinceList => provinceList.countryId == <any>event);
      // console.log('this.searchForm.value', this.searchForm.value);
      this.countrySize = <any>event;
    }
  }

  selectProvinceChange(event: MatSelectChange) {
    if (<any>event !== "") {
      this.btnDisable = false;
    }
  }

  setCityName(nameSize) {
    if (nameSize >= 1) {
      this.btnDisable = false;
      // console.log('ENABLED', this.searchForm.get('countryId').value)
    } else if (nameSize < 1 && (this.countrySize !== undefined || this.countrySize != null)) {
      // console.log('disabled', this.searchForm.get('countryId').value)
      this.btnDisable = true;
    }
  }
}
