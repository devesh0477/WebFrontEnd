import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Country } from 'src/app/models/country';
import { GeneralService } from 'src/app/services/general.service';

declare const $: any;
@Component({
  selector: 'app-country',
  templateUrl: './country.component.html',
  styleUrls: ['./country.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class CountryComponent implements OnInit {

  tableHeader: string[] = ['Country Name', 'Phone Code', 'Edit'];

  public countryList: Array<Country>;
  public newCountriesList: Array<Country>;
  public pageOfItems: Array<Country>;
  public selectedCountry: Country;
  public table;

  constructor(private countryService: GeneralService) { }

  ngOnInit() {
    this.getCountryList();
  }

  /**
   * @author Deivid Mafra;
   * @date 02/16/2020;
   * @param country - is a complete country object;
   * @remarks This method is responsible for allowing the end-user select a country to edit by clicking on that in the table.
   */
  selectCountry(country: Country) {
    this.selectedCountry = country;
    console.log(">>>", this.selectedCountry);
  }

  /**
   * @author Deivid Mafra;
   * @date 02/16/2020;
   * @remarks This method is responsible for loading the country list from the back-end
   */
  getCountryList() {
    let url: string = '/admin/getCountryList';
    this.countryService.getService(url).subscribe(
      (res) => {
        this.countryList = res.data.sort();
      },
      (err) => {
        console.log(err);
      });
  }

  getFilteredCountry(countryName: String) {

    if (countryName === "") {
      this.pageOfItems = this.countryList;
    } else {
      this.pageOfItems = this.countryList.filter(countryList => countryList.name.toLowerCase() === countryName.toLowerCase());
    }
  }

  onChangePage(pageOfItems: Array<Country>) {
    this.pageOfItems = pageOfItems;
  }

}
