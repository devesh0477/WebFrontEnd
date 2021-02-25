import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigTable } from 'src/app/models/configTable';
import { TermsAndConditions } from 'src/app/models/termsAndConditions';
import { ComunicationService } from 'src/app/services/comunication.service';
import { GeneralService } from 'src/app/services/general.service';
import { showNotification } from 'src/app/toast-message/toast-message';

interface Role {
  rolId: number;
  name: string;
};

interface TermPerRole {
  rolId: number;
  rolName: string;
  titleId: number;
  titleName: string;
};

@Component({
  selector: 'app-terms-per-role',
  templateUrl: './terms-per-role.component.html',
  styleUrls: ['./terms-per-role.component.css']
})
export class TermsPerRoleComponent implements OnInit {

  termPerRoleForm = new FormGroup({
    termTitle: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required)
  });

  @ViewChild('termForm') formValues;

  public configTable: ConfigTable = {
    url: '/TermsAndConditions/GetTemplateRoleList',
    headerRow: ['Title', 'Role', 'Actions'],
    columnsName: ['termAndCondition.title', 'role.name', 'delete'],
    hasEditAction: true,
    request: 'get',
    tableTitle: "Terms per Role List"
  };

  public termsTitles: Array<TermsAndConditions>;
  public roles: Array<Role>;
  // public termPerRole: Array<TermPerRole> = [{ "rolId": 1, "rolName": 'x', "titleId": 1, "titleName": 'y' }];
  public loading: boolean = false;

  constructor(private service: GeneralService, private comunication: ComunicationService) { }

  ngOnInit() {
    this.getTermsTitles();
    this.getRoles();
  }

  /**
  * @author Deivid Mafra;
  * @date 01/17/2021;
  */
  getTermsTitles = () => {
    let url = "/TermsAndConditions/GetTermsTitles";
    this.service.getService(url).subscribe(
      res => {
        this.termsTitles = res.data;
      },
      err => {
        console.log(err);
      }
    )
  }

  /**
  * @author Deivid Mafra;
  * @date 01/17/2021;
  */
  getRoles = () => {
    let url: string = "/TermsAndConditions/GetRoles";
    this.service.getService(url).subscribe(
      res => {
        this.roles = res.data;
      },
      err => {
        console.log(err);
      }
    )
  }

  /**
  * @author Deivid Mafra;
  * @date 01/18/2021;
  */
  saveTermPerRole = () => {
    this.loading = true;

    let url: string = '/TermsAndConditions/PostTemplateRole';

    let templateRole = {
      "id": 0,
      "TermAndConditionId": this.termPerRoleForm.get('termTitle').value,
      "RoleId": this.termPerRoleForm.get('role').value
    };

    this.service.post(url, templateRole).subscribe(
      res => {
        if (res.message == 'Ok') {
          console.log('message  == ok')
          this.comunication.sendProcess(res);
          this.clearForm();
          this.loading = false;
          showNotification('top', 'right', 'success', 'New item registered successfully!');
        }
      },
      err => {
        console.log(err);
        this.loading = false;
        showNotification('top', 'right', 'danger', err.error.message);
      }
    )
    // }


  }

  /**
  * @author Deivid Mafra;
  * @date 01/18/2021;
  */
  deleteTermPerRole = termPerRole => {
    let url: string = `/TermsAndConditions/DeleteTemplateRole/${termPerRole.id}`;

    this.service.delete(url).subscribe(
      res => {
        if (res.message == 'Ok') {
          this.comunication.sendProcess(res);
          showNotification('top', 'right', 'success', 'Item deleted successfully!');

        }
        err => {
          console.log(err);
          showNotification('top', 'right', 'danger', err);
        }
      }
    )
  }

  /**
  * @author Deivid Mafra;
  * @date 01/17/2021;
  */
  clearForm = () => {
    this.formValues.resetForm();
  }

}
