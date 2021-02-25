import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { City } from 'src/app/models/city';

@Component({
  selector: 'app-city',
  templateUrl: './city.component.html',
  styleUrls: ['./city.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CityComponent implements OnInit {

  public pageOfItems: Array<City>;
  public cityList: Array<any>;
  public newCityList: Array<City>;

  public provinceList: Array<any>;
  public provinceName: Array<any>;
  public countryList: Array<any>;

  public srcCountryId: number[];
  public srcProvinceId: number = 0;
  public srcCityName: string[];

  public selectedCity: City;
  public table;

  tableHeaders: string[] = ['Provice Name', 'City Name', 'Edit'];

  constructor(private cityService: GeneralService) { }

  ngOnInit() {
    this.getCityList();
    this.getProvinceList();
    this.getCountryList();
  }

  /**
 * @author Deivid Mafra;
 * @date 02/17/2020;
 * @remarks This method is responsible for loading the city list filtered from the back-end
 */
  getCityList() {
    let url: string = '/admin/getCityListFiltered';

    let data = {
      "ProvinceId": this.srcProvinceId.toString() == "" ? 0 : this.srcProvinceId,
      "CityName": this.srcCityName
    }

    this.cityService.post(url, data).subscribe(
      // this.cityService.getService(url).subscribe(
      (res) => {
        this.cityList = res.data.sort((a, b) => (a.name > b.name) ? 1 : -1);
        // console.log('this.cityList', this.cityList)
      },
      (err) => {
        console.log(err);
      });
  }

  /**
  * @author Deivid Mafra;
  * @date 02/16/2020;
  * @remarks This method is responsible for loading the city list from the back-end
  */
  getProvinceList() {
    let url: string = '/admin/getProvinceList';
    this.cityService.getService(url).subscribe(
      (res) => {
        // console.log('res.data', res.data)

        this.provinceList = res.data;

        // console.log("this.provinceList>>>>", this.provinceList);

        (err) => {
          console.log(err);
        }
      });
  }

  getProvince(provinceId) {
    try {
      this.provinceName = this.provinceList.filter(provinceList => provinceList.provinceId == provinceId)
    } catch (error) {
      return "province name";
    }
    return this.provinceName[0].name;
  }

  onChangePage(pageOfItems: Array<City>) {
    this.pageOfItems = pageOfItems;
  }

  getFilteredCity(searchArray) {

    // console.log(searchArray);

    // this.srcCountryId = searchArray.countryId;
    this.srcProvinceId = searchArray.provinceId;
    this.srcCityName = searchArray.name;

    this.getCityList();
  }

  /**
    * @author Deivid Mafra;
    * @date 02/17/2020;
    * @param city - is a complete city object;
    * @remarks This method is responsible for allowing the end-user select a city to edit by clicking on that in the table.
    */
  selectCity(city: City) {
    this.selectedCity = city;
    // console.log(">>>", this.selectedProvince);
  }

  /**
   * @author Deivid Mafra;
   * @date 02/16/2020;
   * @remarks This method is responsible for loading the country list from the back-end
   */
  getCountryList() {
    let url: string = '/admin/getCountryList';
    this.cityService.getService(url).subscribe(
      (res) => {
        this.countryList = res.data.map(country => [country.countryId, country.name]);
        // console.log("this.countryList>>>>", this.countryList);
      },
      (err) => {
        console.log(err);
      });
  }
}  
