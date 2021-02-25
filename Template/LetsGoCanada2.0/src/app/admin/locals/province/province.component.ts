import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { Province } from 'src/app/models/province';

@Component({
  selector: 'app-province',
  templateUrl: './province.component.html',
  styleUrls: ['./province.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ProvinceComponent implements OnInit {

  public pageOfItems: Array<Province>;
  public provinceList: Array<any>;
  public newProvinceList: Array<Province>;
  public countryList: Array<any>;
  public countryName: string[];

  public srcCountryId: number[];
  public srcProvinceName: string[];

  public selectedProvince: Province;
  public table;

  tableHeaders: string[] = ['Country Name', 'Provice Name', 'Edit'];

  constructor(private provinceService: GeneralService) { this.getCountryList(); }

  ngOnInit() {
    this.getProvinceList();
  }

  /**
 * @author Deivid Mafra;
 * @date 02/17/2020;
 * @remarks This method is responsible for loading the province list from the back-end
 */
  getProvinceList() {
    let url: string = '/admin/getProvinceListFiltered';

    let data = {
      "CountryId": this.srcCountryId,
      "ProvinceName": this.srcProvinceName
    }

    this.provinceService.post(url, data).subscribe(
      (res) => {
        this.provinceList = res.data.sort((a, b) => (a.name > b.name) ? 1 : -1);
      },
      (err) => {
        console.log(err);
      });
  }


  /**
 * @author Deivid Mafra;
 * @date 02/16/2020;
 * @remarks This method is responsible for loading the country list from the back-end
 */
  getCountryList() {
    let url: string = '/admin/getCountryList';
    this.provinceService.getService(url).subscribe(
      (res) => {
        this.countryList = res.data.map(country => [country.countryId, country.name]);
      },
      (err) => {
        console.log(err);
      });
  }

  getCountry(countryId) {
    try {
      this.countryName = this.countryList.filter(countryList => countryList[0] == countryId)
    } catch (error) {
      return "country name";
    }
    return this.countryName[0][1] === undefined ? "country name" : this.countryName[0][1];
  }


  onChangePage(pageOfItems: Array<Province>) {
    this.pageOfItems = pageOfItems;
  }

  getFilteredProvince(searchArray) {

    console.log(searchArray);

    if (searchArray.countryId == "" || searchArray.countryId == null) {
      searchArray.countryId = 0;
    }

    this.srcCountryId = searchArray.countryId;
    this.srcProvinceName = searchArray.name;

    this.getProvinceList();
  }

  /**
    * @author Deivid Mafra;
    * @date 02/17/2020;
    * @param province - is a complete province object;
    * @remarks This method is responsible for allowing the end-user select a province to edit by clicking on that in the table.
    */
  selectProvince(province: Province) {
    this.selectedProvince = province;
    // console.log(">>>", this.selectedProvince);
  }
}  