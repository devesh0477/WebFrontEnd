import { Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ConfigTable } from 'src/app/models/configTable';
import { GeneralService } from 'src/app/services/general.service';
import { showNotification } from 'src/app/toast-message/toast-message';
import { ComunicationService } from 'src/app/services/comunication.service';
import { MatSelectChange } from '@angular/material';
import { CommunicationProcess } from 'src/app/models/communicationProcess';
import { VariableList } from 'src/app/models/VariableList';
import { EmailTemplate } from 'src/app/models/emailTemplate';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-emails',
  templateUrl: './emails.component.html',
  styleUrls: ['./emails.component.css']
})
export class EmailsComponent implements OnInit {

  public configTable: ConfigTable = {
    url: '/Email/getEmailTemplates',
    headerRow: ['Template Name', 'Process', 'Created at', 'Modified at', 'Edit', 'Delete'],
    columnsName: ['emailTemplate.name', 'workflowId', 'emailTemplate.dtCreated', 'emailTemplate.dtModified', 'actions', 'delete'],
    hasEditAction: true,
    tableTitle: "Email Template List"
  };

  public processes: Array<CommunicationProcess> = new Array<CommunicationProcess>();
  public variables: Array<VariableList> = new Array<VariableList>();
  public htmlContent;
  public btnName: string = 'Save';

  templateEmailForm = new FormGroup({
    id: new FormControl(''),
    name: new FormControl('', Validators.required),
    subject: new FormControl('', Validators.required),
    template: new FormControl('', Validators.required),
    dtCreated: new FormControl(''),
    process: new FormControl('', Validators.required)
  });

  constructor(private service: GeneralService, private comunication: ComunicationService) { }

  ngOnInit() {
    this.getProcessList();
  }

  /**
  * @author Deivid Mafra;
  * @date 10/15/2020;
  */
  deleteEmailTemplate = (template: EmailTemplate) => {

    let url: string = '/Email/deleteEmailTemplate';
    this.service.post(url, template).subscribe(
      res => {
        if (res.message == 'Ok') {
          this.comunication.sendProcess(res);
          showNotification('top', 'right', 'success', 'Register deleted successfully!');
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

  /**
  * @author Deivid Mafra;
  * @date 10/15/2020;
  */
  getEmailTemplateById = (item) => {
    console.log('Object: ', item);

    this.templateEmailForm.get('process').setValue(item.workflowId);
    this.onChangeProcessList(item.workflowId);

    this.getTemplateByIdProcess(item.emailTemplateId);
  }

  /**
   * @param emailTemplateId
   * @author Diego.Perez
   * @date 01/18/2021
   */
  getTemplateByIdProcess = (emailTemplateId) => {
    let url: string = '/Email/getEmailTemplateById/' + emailTemplateId;
    this.service.getService(url).subscribe(
      res => {

        this.populateForm(res.data);
      },
      err => {
        console.log(err)
      })
  }

  /**
   * @param item 
   * @author Diego.Perez
   * @date 01/18/2021
   */
  populateForm = item => {
    this.templateEmailForm.get('id').setValue(item.emailTemplateId);
    this.templateEmailForm.get('name').setValue(item.name);
    this.templateEmailForm.get('subject').setValue(item.subject);
    this.templateEmailForm.get('template').setValue(item.template);
    this.templateEmailForm.get('dtCreated').setValue(item.dtCreated);
    console.log(item);
    this.btnName = 'Update';
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

  /**
  * @author Deivid Mafra - Diego Perez;
  * @date 10/31/2020;
  */
  onChangeProcessList = (processId: MatSelectChange) => {

    console.log('THIS IS THE PROCESS::::: ', processId);

    this.service.getService('/Email/getEmailTemplateByProcessId/' + processId).subscribe(
      res => {
        if (res.message == 'Ok') {
          console.log('THE ANSWER HERE:::::::::::::::::: ', res)
          this.populateForm(res.data);
        }
      },
      err => {
        console.log(err)
      }
    )

    this.processes.forEach(process => {
      if (process.processID == <any>processId) {
        this.variables = process.variableList;
      }
    })

  }

  /**
  * @author Deivid Mafra;
  * @date 10/15/2020;
  */
  saveEmailTemplate = () => {
    let url: string = '/Email/saveEmailTemplate';

    let saveEmailObj: EmailTemplate = new EmailTemplate();

    if (typeof !isNullOrUndefined(this.templateEmailForm.get('id').value) && this.templateEmailForm.valid) {

      // saveEmailObj.name = this.templateEmailForm.get('name').value;
      // saveEmailObj.template = this.templateEmailForm.get('template').value;
      // saveEmailObj.dtCreated = new Date();
      // saveEmailObj.dtModified = new Date();
      // saveEmailObj.lastUserModified = 1;
      // saveEmailObj.subject = this.templateEmailForm.get('subject').value;

      // } else {

      saveEmailObj.emailTemplateId = this.templateEmailForm.get('id').value;
      saveEmailObj.name = this.templateEmailForm.get('name').value;
      saveEmailObj.template = this.templateEmailForm.get('template').value;
      saveEmailObj.dtCreated = this.templateEmailForm.get('dtCreated').value;
      saveEmailObj.dtModified = new Date();
      saveEmailObj.lastUserModified = 1;
      saveEmailObj.subject = this.templateEmailForm.get('subject').value;



      console.log('saveEmailObj', saveEmailObj);

      if (this.templateEmailForm.valid) {
        this.service.post(url, saveEmailObj).subscribe(
          res => {
            if (res.message == 'Ok') {
              this.comunication.sendProcess(res);
              showNotification('top', 'right', 'success', `Template ${saveEmailObj.name} ${this.btnName}d successfully!`);
              this.clearForm();
            }
          },
          err => {
            console.log(err);
            showNotification('top', 'right', 'danger', err);
          }
        )
      } else {
        showNotification('top', 'right', 'danger', 'the form is ' + this.templateEmailForm.status);
      }
    } else {
      showNotification('top', 'right', 'info', `Fill The Form!`);
    }
  }

  clearForm = () => {
    this.templateEmailForm.reset();
    this.btnName = 'Save';
    this.variables = new Array<VariableList>();
  }

  show = (variable) => {
    console.log(variable);
    let email: string = '';
    email = this.templateEmailForm.get('template').value;
    if (isNullOrUndefined(email)) {
      email = '';
    }

    if (!email.includes(variable))
      email = email.concat(variable);
    else
      email = email.replace(variable, '');

    console.log(email);
    this.templateEmailForm.get('template').setValue(email);

  }

  isChecked(variable) {

    let email: string = '';
    email = this.templateEmailForm.get('template').value;
    if (isNullOrUndefined(email)) {
      email = '';
    }

    if (email.includes(variable))
      return true
    else
      return false;
  }

}
