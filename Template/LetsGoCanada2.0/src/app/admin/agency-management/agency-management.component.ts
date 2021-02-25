import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges, Input } from '@angular/core';
import { NgModel } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { MatSelectChange } from '@angular/material';
import { Agency } from 'src/app/models/agency';
import { Router } from '@angular/router';

declare const $: any;

@Component({
  selector: 'app-agency-management',
  templateUrl: './agency-management.component.html',
  styleUrls: ['./agency-management.component.css']
})

export class AgencyManagementComponent implements OnInit {
  countries: string[];
  tableHeader: string[];

  agencies: any[];
  provinces: string[];
  cities: string[];
  selectedCountry: string[] = [];

  selectedProvince: string[] = [];
  selectedCity: string[] = [];
  pageOfItems: Array<Agency>;


  constructor(private agencyService: GeneralService, private router: Router) { }

  /**
  * @author Deivid Mafra;
  * @date 11/13/2019;
  * @remarks This method returns the countries list. It's useful for the search engine dropdown list.
  */
  getCountryNationality() {
    let url = "/School/getGeoList";
    this.agencyService.getService(url).subscribe(
      (res) => {
        this.countries = res.data.country;
        // console.log("AGENCY countries>>>", this.countries)
      },
      (err) => {
        console.log(err);
      }
    )
  }

  /**
  * @author Deivid Mafra;
  * @date 11/13/2019;
  * @remarks This method returns the provinces and cities lists. It's useful for the search engine dropdown list.
  */
  getProvincesAndCities() {
    let url = "/agent/getCityProvinceFilter";
    this.agencyService.getService(url).subscribe(
      (res) => {
        this.provinces = res.data.Province;
        // console.log("AGENCY provinces>>>", this.provinces)
        this.cities = res.data.City;
        // console.log("AGENCY cities>>>", this.cities)
      },
      (err) => {
        console.log(err);
      }
    )
  }

  onCountryChange(event: MatSelectChange) {
    // console.log("event Country>>", event)
    this.selectedCountry = <any>event;
  }

  onProvinceChange(event: MatSelectChange) {
    // console.log("event Province>>", event)
    this.selectedProvince = <any>event;
  }

  onCityChange(event: MatSelectChange) {
    // console.log("event City>>", event)
    this.selectedCity = <any>event;
  }

  /**
   * @author Deivid Mafra;
   * @date 11/13/2019;
   * @remarks This method is responsible for feed the agencies list with the values corresponding to the passed keys.
   */
  getSearchAgency() {

    let url: string = '/agent/searchAgency';
    let data = {
      "CountryID": this.selectedCountry,
      "ProvinceName": this.selectedProvince,
      "CityName": this.selectedCity
    }
    this.agencyService.post(url, data).subscribe(
      (res) => {
        this.agencies = res.data;
      },
      (err) => {
        console.log(err);
      })
  }

  /**
   * @author Deivid Mafra;
   * @date 11/13/2019;
   * @remarks This method is responsible to clear all the dropdown lists up.
   * @param country
   * @param province
   * @param city
   */
  deselectAll(country: NgModel, province: NgModel, city: NgModel) {
    country.update.emit([]);
    province.update.emit([]);
    city.update.emit([]);
    this.selectedCountry = [];
    this.selectedProvince = [];
    this.selectedCity = [];
  }

  ngOnInit() {
    this.tableHeader = ['ID', 'Country', 'Name', 'Web Site', 'Complete', 'Approved', 'Edit'];
    this.getSearchAgency();
    this.getCountryNationality();
    this.getProvincesAndCities();
  }

  onChangePage(pageOfItems: Array<Agency>) {
    this.pageOfItems = pageOfItems;
  }
}