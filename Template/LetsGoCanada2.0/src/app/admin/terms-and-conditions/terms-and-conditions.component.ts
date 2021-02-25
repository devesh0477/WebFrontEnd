import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigTable } from 'src/app/models/configTable';
import { GeneralService } from 'src/app/services/general.service';
import { showNotification } from 'src/app/toast-message/toast-message';
import { ComunicationService } from 'src/app/services/comunication.service';
import { MatSelectChange } from '@angular/material';
import { CommunicationProcess } from 'src/app/models/communicationProcess';
import { VariableList } from 'src/app/models/VariableList';
import { TermsAndConditions } from 'src/app/models/termsAndConditions';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.css']
})
export class TermsAndConditionsComponent implements OnInit {

  // columnsName: ['termsandconditions.id', 'termsandconditions.title', 'termsandconditions.termstext', 'visible', 'actions', 'delete'],
  public configTable: ConfigTable = {
    url: '/TermsAndConditions/GetTermsAndCondition',
    headerRow: ['Title', 'Terms Text', 'Visible', 'Edit', 'Delete'],
    columnsName: ['title', 'termsText', 'visible', 'actions', 'delete'],
    hasEditAction: true,
    tableTitle: "Terms and Conditions Template List"
  };

  public processes: Array<CommunicationProcess> = new Array<CommunicationProcess>();
  public variables: Array<VariableList> = new Array<VariableList>();
  public htmlContent;

  public templateTC: TermsAndConditions;

  templateTCForm = new FormGroup({
    id: new FormControl(''),
    title: new FormControl('', Validators.required),
    template: new FormControl('', Validators.required),
    rdStatus: new FormControl('', Validators.required)
  });

  constructor(private service: GeneralService, private comunication: ComunicationService) { }

  ngOnInit() {
    this.getProcessList();
  }

 deleteTargetTemplate = (item) => {
    let url: string = '/TermsAndConditions/DeleteTermsAndConditions/' + item.id ;
    this.service.getService(url).subscribe(
      res => {
        if (res.message == 'Ok') {
          this.comunication.sendProcess(res);
          showNotification('top', 'right', 'success', 'Register deleted successfully!');
          this.getProcessList();
        }
        err => {
          console.log(err);
          showNotification('top', 'right', 'danger', err);
        }
      },
      err => {
        console.log(err)
      }
    )
  }

 getTargetById = (item) => {
    let url: string = '/TermsAndConditions/getTermAndCondition/' + item.id;
    this.service.getService(url).subscribe(
      res => {
        this.templateTCForm.get('id').setValue(item.id);
        this.templateTCForm.get('title').setValue(res.data[0].title);
        this.templateTCForm.get('template').setValue(res.data[0].termsText);
        this.templateTCForm.get('rdStatus').setValue(res.data[0].visible.toString());
        console.log(res.data);
      },
      err => {
        console.log(err)
      })
  }

  /**
  * @author Deivid Mafra;
  * @date 10/15/2020;
  */
  getProcessList = () => {
    let url: string = '/Email/getCommunicationProcess';
    this.service.getService(url).subscribe(
      res => {
        this.processes = res.data;
      },
      err => {
        console.log(err)
      }
    )
  }

  // /**
  // * @author Deivid Mafra - Diego Perez;
  // * @date 10/31/2020;
  // */
  // onChangeProcessList = (processID: MatSelectChange) => {

  //   this.processes.forEach(process => {
  //     if (process.processID == <any>processID) {
  //       this.variables = process.variableList;
  //     }
  //   })

  // }

  /**
  * @author Deivid Mafra;
  * @date 10/15/2020;
  */
 saveTermsAndConditionsTemplate = () => {
    let url: string = '/TermsAndConditions/PostTermAndCondition';

    let termsAndConditionsObj: TermsAndConditions = new TermsAndConditions();

    termsAndConditionsObj.Title = this.templateTCForm.get('title').value;
    termsAndConditionsObj.TermsText = this.templateTCForm.get('template').value;
    termsAndConditionsObj.Visible = this.templateTCForm.get('rdStatus').value;
    if (this.templateTCForm.get('id') != null && this.templateTCForm.get('id').value != "" ) {
        termsAndConditionsObj.ID = this.templateTCForm.get('id').value;
    }

    if (this.templateTCForm.valid) {
      this.service.postWithoutAuth(url, termsAndConditionsObj).subscribe(
        res => {
          if (res.message == 'Ok') {
            this.comunication.sendProcess(res);
            showNotification('top', 'right', 'success', `Template ${termsAndConditionsObj.Title} saved successfully!`);
          }
        },
        err => {
          console.log(err);
          showNotification('top', 'right', 'danger', err);
        }
      )
    } else {
      showNotification('top', 'right', 'danger', 'the form is ' + this.templateTCForm.status);
    }
  }

  clearForm = () => {
    this.templateTCForm.reset();
  }

  //   show = (variable) => {
  //     console.log(variable);
  //     let email: string = '';
  //     email = this.templateTCForm.get('template').value;
  //     if (isNullOrUndefined(email)) {
  //       email = '';
  //     }

  //     if (!email.includes(variable))
  //       email = email.concat(variable);
  //     else
  //       email = email.replace(variable, '');

  //     console.log(email);
  //     this.templateTCForm.get('template').setValue(email);

  //   }

  //   isChecked(variable) {

  //     let email: string = '';
  //     email = this.templateTCForm.get('template').value;
  //     if (isNullOrUndefined(email)) {
  //       email = '';
  //     }

  //     if (email.includes(variable))
  //       return true
  //     else
  //       return false;
  //   }

}
