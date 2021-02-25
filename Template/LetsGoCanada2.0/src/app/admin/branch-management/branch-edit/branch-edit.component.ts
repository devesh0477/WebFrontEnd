import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { BranchManagementComponent } from '../branch-management.component';
import { MatSelectChange } from '@angular/material';
import { City } from 'src/app/models/city';
import { Province } from 'src/app/models/province';
import { showNotification } from 'src/app/toast-message/toast-message';

declare const $: any;

@Component({
  selector: 'app-branch-edit',
  templateUrl: './branch-edit.component.html',
  styleUrls: ['./branch-edit.component.css']
})
export class BranchEditComponent implements OnInit {

  @Input() branchToEdit;
  @ViewChild('branchForm') formValues;
  setCeo: boolean = false;
  agencies: string[];
  countries: string[];
  provinces: Array<Province>
  provincesByCountry: Array<Province>
  cities: Array<City>;
  citiesByProvince: Array<City>;
  branches: string[];
  headquarters: boolean = false;

  branchId;

  constructor(private agentService: GeneralService, private reloadList: BranchManagementComponent) { }

  ngOnInit() {
    this.getBranchPerRole();
    this.getAgencyPerRole();
    this.getCountryNationality()
  }

  /**
  * @remark This method returns a list of agencies. It's available to fill the form.
  * @date 11/04/2019
  * @author Deivid Mafra
  */
  getAgencyPerRole = () => {

    let url: string = '/agent/getAgencyPerRole';
    this.agentService.getService(url).subscribe(
      (res) => {
        this.agencies = res.data;
        // console.log("this.agencies>>>", this.agencies)
      },
      (err) => {
        console.log(err);
      })
  }

  /**
* @remark This method returns a list of branches.
* @date 11/04/2019
* @author Deivid Mafra
*/
  getBranchPerRole = () => {

    let url: string = '/agent/getBranchPerRole';
    let data = {
      "idSet": [],
    }
    this.agentService.post(url, data).subscribe(
      (res) => {
        this.branches = res.data;
      },
      (err) => {
        console.log(err);
      })
  }

  /**
  * @remark This method returns lists of countries, provinces, and cities from the back-end.
  * @date 11/04/2019
  * @author Deivid Mafra
  */
  getCountryNationality = () => {
    let url = "/School/getGeoList";
    this.agentService.getService(url).subscribe(
      (res) => {
        this.countries = res.data.country;
        this.provinces = new Array<Province>();
        this.provinces = res.data.province;
        this.cities = new Array<City>();
        this.cities = res.data.city;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  selectCountryChange = (event: MatSelectChange) => {
    this.getProvinceByCountry(<any>event);
  }

  /**
 * @remark This method is responsible to create a list of provinces based on the country Id.
 * @date 11/04/2019
 * @author Deivid Mafra
 * @param countryId
 */
  getProvinceByCountry = countryId => {
    this.provincesByCountry = new Array<City>();
    this.provinces.forEach(province => {
      if (province.countryId == countryId) {
        this.provincesByCountry.push(province);
      }
    });
  }

  selectProvinceChange = (event: MatSelectChange) => {
    this.getCitiesByProvince(<any>event);
  }

  /**
   * @remark This method is responsible to create a list of cities based on the province Id.
   * @date 11/04/2019
   * @author Deivid Mafra
   * @param provinceId
   */
  getCitiesByProvince = provinceId => {
    this.citiesByProvince = new Array<City>();
    this.cities.forEach(city => {
      if (city.provinceId == provinceId) {
        this.citiesByProvince.push(city);
      }
    });
  }

  /**
  * @author Deivid Mafra;
  * @date 11/04/2019;
  * @remarks It clears the input from AgentManagementComponent.
  */
  clear = () => {
    this.formValues.resetForm();
    this.reloadList.ngOnInit();
    this.branchToEdit = null;
  }

  /**
    * @author Deivid Mafra;
    * @date 11/04/2019;
    * @remarks This method submit the info from the form to the back-end after validation.
    * @param value form values
    * @param valid It is send to the end-point only whether the valid parameter is true.
    */
  onSubmit({ value, valid }: { value: any, valid: boolean }) {

    if (!valid) {
      // console.log("value>>>", value);
      // console.log("formValues>>>", this.formValues);
      showNotification('top', 'right', 'danger', 'Please check all fields in RED and fill out the form correctly!')

    } else {

      let url: string = '/agent/setBranch';

      value = {
        "branchId": value.branchId,
        "agencyId": value.agencyId, //Done
        "headquarters": value.headquarters === null ? this.headquarters : value.headquarters, //Done
        "officeName": value.officeName, //Done
        "addressLine1": value.addressLine1,//Done
        "addressLine2": value.addressLine2,// Done
        "city": value.city,//Done
        "province": value.province,//Done
        "countryId": value.countryId, //Done
        "postalCode": value.postalCode, //Done
        "phone": value.phone, //Done
        "email": value.email, //Done
        "agency": null,// <-Can ignore
        "country": {
          "countryId": value.countryId, //Done up
          "name": null,//value.countryName, I think I can ignore
          "phoneCode": null,// <-Can ignore
          "agent": [],// <-Can ignore
          "applicantCitizenship": [],// <-Can ignore
          "applicantCountry": [],// <-Can ignore
          "branch": [],// <-Can ignore
          "educationLevel": [],// <-Can ignore
          "highestEducationDetails": [],// <-Can ignore
          "lgcpersonal": [],// <-Can ignore
          "province": [],// <-Can ignore
          "school": []// <-Can ignore
        },
        "agent": []//
      }

      if (value.branchId === 0) {
        this.addNewBranch(url, value);
      } else {
        this.updateBranch(url, value);
      }
    }
  }

  addNewBranch = (uri, newBranch) => {
    this.agentService.post(uri, newBranch).subscribe(
      (res) => {
        if (res.message == 'Ok') {
          showNotification('top', 'right', 'success', 'Branch created successfully!');
          this.formValues.resetForm();
          this.reloadList.ngOnInit();
          this.branchToEdit = null;
        }
      },
      (err) => {
        console.log(err)
        showNotification('top', 'right', 'danger', 'Error trying to create a branch!')
      }
    )
  }

  updateBranch = (uri, branch) => {
    this.agentService.post(uri, branch).subscribe(
      (res) => {
        if (res.message == 'Ok') {
          showNotification('top', 'right', 'success', 'Branch updated successfully!');
          this.formValues.resetForm();
          this.reloadList.ngOnInit();
          this.branchToEdit = null;
        }
      },
      (err) => {
        console.log(err)
        showNotification('top', 'right', 'danger', 'Error trying to update the branch info!')
      }
    )
  }

}
