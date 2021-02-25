import { PaymentUpdate } from './../../models/paymentUpdate';
import { GeneralService } from './../../services/general.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { showNotification } from 'src/app/toast-message/toast-message';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent implements OnInit {

  public pageOfItems: Array<any>;
  public processList: any;
  public editProcessStatus: any;
  public formStatus = new FormControl();
  public nextStatus: any;

  public srcApplicationID;
  public srcApplicantID;
  public srcApplicantName;
  public srcStatusID: string[];
  public srcSchoolID: number[];
  public srcProgramID: number[];
  public srcAgencyID: string[];
  public srcAgentID: string[];
  public srcStartDate;
  public srcEndDate;

  public appPayments;

  public updPaymentData: PaymentUpdate;

  setStatusForm = new FormGroup({
    paidDate: new FormControl('', Validators.required),
    paidAmount: new FormControl('', Validators.required),
    nextStatus: new FormControl('', Validators.required),
    dealReference: new FormControl('', Validators.required)
  });

  // tableHeaders: string[] = ['Application', 'Date', 'Deal Reference', 'Agency', 'Agent Name', 'Intake', 'Payment Concept', 'Amount', 'status', 'Paid Amount', 'Paid Date', 'Western Union ID', 'Applicant Id', 'Applicant Name', 'School', 'Program', 'Edit'];
  tableHeaders: string[] = ['Application', 'Date', 'Deal Reference', 'Agency', 'Agent Name', 'Intake', 'Payment Concept', 'status', 'Applicant Id', 'Applicant Name', 'School', 'Program', 'Edit'];
  constructor(private dashboardService: GeneralService) { }

  ngOnInit() {
    this.getDashboardData();
  }

  getDashboardData = () => {
    let url = '/Payment/getPaymentDashboard';

    let data = {
      "ApplicationID": this.srcApplicationID === undefined || this.srcApplicationID == "" ? 0 : this.srcApplicationID,
      "ApplicantID": this.srcApplicantID === undefined || this.srcApplicantID == "" ? 0 : this.srcApplicantID,
      "ApplicantName": this.srcApplicantName === undefined || this.srcApplicantName == "" ? "" : this.srcApplicantName,
      "StatusID": this.srcStatusID === undefined || this.srcStatusID == [""] ? [] : [this.srcStatusID],
      "SchoolID": this.srcSchoolID === undefined || this.srcSchoolID == [] ? [] : [this.srcSchoolID],
      "ProgramID": this.srcProgramID === undefined || this.srcProgramID == [] ? [] : [this.srcProgramID],
      "AgencyID": this.srcAgencyID === undefined || this.srcAgencyID == [""] ? [] : [this.srcAgencyID],
      "AgentID": this.srcAgentID === undefined || this.srcAgentID == [""] ? [] : [this.srcAgentID],
      "StartDate": this.srcStartDate === undefined || this.srcStartDate == "" ? "1/1/1900" : this.srcStartDate,
      "EndDate": this.srcEndDate === undefined || this.srcEndDate == "" ? "12/31/2999" : this.srcEndDate
    };

    // console.log('data', data)

    this.dashboardService.post(url, data).subscribe(
      res => {
        this.processList = res.data;
        // console.log('this.processList', this.processList)
      },
      err => {
        console.log(err);
      }
    )

  }

  selectProcess = process => {
    this.editProcessStatus = process;
    // console.log('process', process);

    this.getApplicationPayments(process.applicationID);
    this.getNextStatusList(process.stateID);
    this.getDataToUpdatePaymentState(process.id);
  }

  getFilteredCity = searchArray => {
    this.srcApplicationID = searchArray.applicationId;
    this.srcApplicantID = searchArray.applicantId;
    this.srcApplicantName = searchArray.stName;
    this.srcStatusID = searchArray.status;
    this.srcSchoolID = searchArray.school;
    this.srcProgramID = searchArray.program;
    this.srcAgencyID = searchArray.agency;
    this.srcAgentID = searchArray.agent;
    this.srcStartDate = searchArray.startDate;
    this.srcEndDate = searchArray.endDate;

    // console.log('searchArray', searchArray)

    this.getDashboardData();
  }

  getNextStatusList = id => {
    let url = '/Payment/getNextStatus/';

    this.dashboardService.getService(url + id).subscribe(
      res => {
        this.nextStatus = res.data;
      },
      err => {
        console.log(err);
      }
    )
  }

  getApplicationPayments = id => {
    let url = '/Payment/getApplicationPayments/';
    this.dashboardService.getService(url + id).subscribe(
      res => {
        this.appPayments = res.data;
        // console.log('this.appPayments', this.appPayments)
      },
      err => {
        console.log(err);
      }
    )
  }

  onChangePage = (pageOfItems: Array<any>) => {
    this.pageOfItems = pageOfItems;
  }

  updatePaymentState = () => {

    // console.log('this.updPaymentData', this.updPaymentData);

    let data = {
      "ID": this.updPaymentData.id,
      "ApplicationID": this.updPaymentData.applicationId,
      "ApplicationCostID": this.updPaymentData.applicationCostId,
      "WUServiceID": this.updPaymentData.wuserviceId,
      "ExpectedAmount": this.updPaymentData.expectedAmount,
      "PaidAmount": this.setStatusForm.get('paidAmount').value,
      "StateID": this.setStatusForm.get('nextStatus').value,
      "PaidDate": this.setStatusForm.get('paidDate').value,
      "DealReference": this.setStatusForm.get('dealReference').value
      //this.updPaymentData.dealReference
    }

    // console.log('this.updPaymentData', this.updPaymentData)

    let postUrl = '/Payment/updatePaymentState';

    if (!this.setStatusForm.valid)
      showNotification('top', 'right', 'warning', 'Please make sure all fields are filled!');
    else {
      this.dashboardService.post(postUrl, data).subscribe(

        res => {
          if (res.message == "Ok") {
            // console.log('res', res);
            this.getDashboardData();

            this.editProcessStatus.paidAmount = res.data.paidAmount;
            this.editProcessStatus.paidDate = res.data.paidDate;
            this.editProcessStatus.stateName = this.nextStatus[0].nextStateName;

            this.editProcessStatus.dealReference = res.data.dealReference;
            // console.log('this.nextStatus[0].nextStateName', this.nextStatus[0].nextStateName)

            showNotification('top', 'right', 'success', 'Payment state updated!');
          }
        },
        err => {
          showNotification('top', 'right', 'danger', 'Error trying to update the payment state!');
          console.log(err)
        });
    }
    this.setStatusForm.reset();
  }

  getDataToUpdatePaymentState = paymentId => {
    let url = '/Payment/getPayment/' + paymentId;
    // console.log('url', url)
    this.dashboardService.getService(url).subscribe(
      res => {
        this.updPaymentData = res.data[0];
        // console.log('updPaymentData.id', this.updPaymentData.id);
      },
      err => {
        showNotification('top', 'right', 'danger', "Error trying to get date to update the payment state!");
        console.log(err)
      });
  }

}
