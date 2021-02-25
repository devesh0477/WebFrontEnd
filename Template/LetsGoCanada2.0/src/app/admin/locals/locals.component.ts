import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-locals',
  templateUrl: './locals.component.html',
  styleUrls: ['./locals.component.css']
})
export class LocalsComponent implements OnInit {
  constructor(private localServices: GeneralService) { }
  countryList: string[];
  provinceList: string[];
  cityList: string[];
  languageList: string[];

  ngOnInit() {
    this.getCountryList();
    this.getProvinceList();
    this.getCityList();
    this.getLanguageList();
  }


  /**
   * @author Deivid Mafra;
   * @date 02/16/2020;
   * @remarks This method is responsible for loading the country list from the back-end
   */
  getCountryList() {
    let url: string = '/admin/getCountryList';
    this.localServices.getService(url).subscribe(
      (res) => {
        this.countryList = res.data.sort();
        // console.log("this.countryList from locals:>>>>", this.countryList)
      },
      (err) => {
        console.log(err);
      });
  }

  /**
   * @author Deivid Mafra;
   * @date 02/17/2020;
   * @remarks This method is responsible for loading the province list from the back-end
   */
  getProvinceList() {
    let url: string = '/admin/getProvinceList';
    this.localServices.getService(url).subscribe(
      (res) => {
        this.provinceList = res.data.sort((a, b) => (a.name > b.name) ? 1 : -1);
        // console.log("this.provinceList from locals:>>>>", this.provinceList)
      },
      (err) => {
        console.log(err);
      });
  }


  /**
   * @author Deivid Mafra;
   * @date 02/24/2020;
   * @remarks This method is responsible for loading the city list from the back-end
   */
  getCityList() {
    let url: string = '/admin/getCityList';
    this.localServices.getService(url).subscribe(
      (res) => {
        this.cityList = res.data.sort((a, b) => (a.name > b.name) ? 1 : -1);
        // console.log("this.cityList from locals:>>>>", this.cityList)
      },
      (err) => {
        console.log(err);
      });
  }

  /**
   * @author Deivid Mafra;
   * @date 02/24/2020;
   * @remarks This method is responsible for loading the language list from the back-end
   */
  getLanguageList() {
    let url: string = '/admin/getLanguageList';
    this.localServices.getService(url).subscribe(
      (res) => {
        this.languageList = res.data.sort((a, b) => (a.name > b.name) ? 1 : -1);
        // console.log("this.languageList from locals:>>>>", this.languageList)
      },
      (err) => {
        console.log(err);
      });
  }

}
