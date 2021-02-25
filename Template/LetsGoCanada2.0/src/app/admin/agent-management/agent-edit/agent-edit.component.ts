import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { AgentManagementComponent } from '../agent-management.component';
import { Agent } from 'src/app/models/agent';

declare const $: any;
@Component({
  selector: 'app-agent-edit',
  templateUrl: './agent-edit.component.html',
  styleUrls: ['./agent-edit.component.css']
})
export class AgentEditComponent implements OnInit {
  @Input() agentToEdit;
  @ViewChild('agentForm') formValues;
  setCeo: boolean = false;
  roles: string[];
  countries: string[];
  branches: string[];

  agencies;

  ceo;
  loginId;
  selectedAgency;
  selectedBranch;
  selectedAgent;

  public dataBranch = {
    "idSet": [],
  }


  constructor(private agentService: GeneralService, private reloadList: AgentManagementComponent) { }

  ngOnInit() {
    this.getAgentyPerRole();
    this.getBranchPerRole();
    this.getRolePerRole();
    this.getCountryNationality()
  }

  /**
   * @author Deivid Mafra;
   * @date 10/24/2019;
   * @remarks This method returns a list of roles to be chosen by the end-user in the dropdown list in the form.
   */
  getRolePerRole() {
    let url = "/user/getRolePerRole";
    this.agentService.getService(url).subscribe(
      (res) => {
        this.roles = res.data;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  /**
   * @author Diego.Perez
   * @date 03/23/2020.
   */
  getAgentyPerRole() {
    let url: string = '/Agent/getAgencyPerRole';

    this.agentService.getService(url).subscribe(
      (res) => {
        this.agencies = res.data;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  /**
   * @author Diego.Perez
   * @param value 
   * @date 03/23/2020
   */
  agencyChange(value) {
    this.dataBranch.idSet[0] = value;
    this.getBranchPerRole();
  }

  /**
   * @author Deivid Mafra;
   * @date 11/01/2019;
   * @remarks This method returns a list of branches to be chosen by the end-user in the dropdown list in the form.
   */
  getBranchPerRole() {

    let url: string = '/agent/getBranchPerRole';

    this.agentService.post(url, this.dataBranch).subscribe(
      (res) => {
        this.branches = res.data;
      },
      (err) => {
        console.log(err);
      })
  }

  /**
   * @author Deivid Mafra;
   * @date 10/30/2019;
   * @remarks This method returns a list of countries to be chosen by the end-user in the dropdown list in the form.
   */
  getCountryNationality() {
    let url = "/applicant/getCountryNationality";
    this.agentService.getService(url).subscribe(
      (res) => {
        this.countries = res.data;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  showNotification(from: any, align: any, type: any, messages: any): void {
    $.notify({
      icon: 'notifications',
      message: messages
    }, {
      type: type,
      timer: 1500,
      placement: {
        from: from,
        align: align
      },
      template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
        '<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
        '<i class="material-icons" data-notify="icon">notifications</i> ' +
        '<span data-notify="title">{1}</span> ' +
        '<span data-notify="message">{2}</span>' +
        '<div class="progress" data-notify="progressbar">' +
        '<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
        '</div>' +
        '<a href="{3}" target="{4}" data-notify="url"></a>' +
        '</div>'
    });
  }

  /**
   * @author Deivid Mafra;
   * @date 10/30/2019;
   * @remarks Cleaning the input from AgentManagementComponent
   */
  clear() {
    this.formValues.resetForm();
    this.reloadList.ngOnInit();
    this.agentToEdit = null;
  }

  /**
   * @author Deivid Mafra;
   * @date 10/30/2019;
   * @remarks This method is responsible for validate and send the info from the form to the back-end.
   * @param value 
   * @param valid
   */
  onSubmit({ value, valid }: { value: any, valid: boolean }) {

    if (!valid) {
      // this.formValues.touched = true;
      console.log(this.formValues);

      Object.keys(this.formValues.controls).forEach(key => {
        this.formValues.controls[key].markAsTouched();
      });
      this.showNotification('top', 'right', 'danger', 'Please fill out the form correctly');

    } else {

      // console.log("Showing Value###", value)
      let url: string = '/agent/setAgent';

      value = {
        "loginId": value.loginId,
        "email": value.email,
        "password": null,
        "roleId": value.roleId,
        "active": value.active,
        "role": {
          "rolId": 0,
          "name": null,
          "description": null,
          "active": false,
          "roleMenu": [],
          "userLogin": []
        },
        "agent": {
          "agentId": value.loginId,
          "branchId": value.branchId,
          "firstName": value.firstName,
          "lastName": value.lastName,
          "salutation": value.salutation,
          "citizenshipId": value.citizenshipId,
          "phone": value.phone,
          "passportNumber": value.passportNumber,
          "ceo": value.ceo,
          "keyword": null,
          "agentNavigation": null,
          "branch": {
            "branchId": 0,
            "agencyId": 0,
            "headquarters": false,
            "officeName": null,
            "addressLine1": null,
            "addressLine2": null,
            "city": null,
            "province": null,
            "countryId": null,
            "postalCode": null,
            "phone": null,
            "email": null,
            "agency": {
              "agencyId": 0,
              "companyName": null,
              "webSite": null,
              "profileComplete": null,
              "profileApproved": null,
              "agencyDocuments": [],
              "branch": [],
              "canadianInstitutions": []
            },
            "country": null,
            "agent": []
          },
          "citizenship": {
            "countryId": 0,
            "name": null,
            "phoneCode": null,
            "agent": [],
            "applicantCitizenship": [],
            "applicantCountry": [],
            "branch": [],
            "educationLevel": [],
            "highestEducationDetails": [],
            "lgcpersonal": [],
            "province": [],
            "school": []
          },
          "applicant": []
        },
        "applicant": null,
        "lgcpersonal": null,
        "loginStatus": null,
        "notes": [],
        "securityQuestions": []
      }

      this.agentService.post(url, value).subscribe(
        (res) => {
          if (res.message == 'Ok') {
            this.showNotification('top', 'right', 'success', 'Agent created / updated successfully!');
            this.formValues.resetForm();
            this.reloadList.ngOnInit();
            this.agentToEdit = null;
          }
        },
        (err) => {
          console.log(err)
          this.showNotification('top', 'right', 'danger', 'Error trying to create / update the agent info!')
        }
      )
    }
  }
}
