import { PaymentState } from 'src/app/models/paymentState';
import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { PaymentWorkflow } from 'src/app/models/paymentWorkflow';

@Component({
  selector: 'app-payment-workflow',
  templateUrl: './payment-workflow.component.html',
  styleUrls: ['./payment-workflow.component.css']
})
export class PaymentWorkflowComponent implements OnInit {

  // tableHeader: string[] = ['Current State N', 'Current State', 'Next State', 'Next State N', 'Edit'];
  tableHeader: string[] = ['Current State', 'Next State', 'Edit'];

  public pStatesWorkflowList: Array<PaymentWorkflow>;
  public pageOfItems: Array<PaymentWorkflow>;
  public selectedWorkflow: PaymentWorkflow;
  public state: PaymentState[];
  public pStatesList: Array<any>;
  public table;

  constructor(private paymentService: GeneralService) { this.getPaymentState(); }

  ngOnInit() {
    this.getPaymentWorkflow();
  }

  /**
   * @author Deivid Mafra;
   * @date 05/14/2020;
   * @remarks This method is responsible for fetching the PaymentWorkflow List from the endpoint.
   */
  getPaymentWorkflow = () => {
    let url = '/Payment/getPaymentWorkflowList';
    this.paymentService.getService(url).subscribe(
      res => {
        this.pStatesWorkflowList = res.data;
        console.log('this.pStatesWorkflowList', this.pStatesWorkflowList);
      },
      err => {
        console.log(err);
      })
  }

  /**
   * @author Deivid Mafra;
   * @date 05/14/2020;
   * @param workflow - is a complete PaymentWorkflow object;
   * @remarks This method is responsible for allowing the end-user select a PaymentWorkflow to edit by clicking on that in the table.
   */
  selectWorkflow = (workflow) => {

    let newWorkflow: PaymentWorkflow = {
      id: workflow.id,
      curentState: workflow.curentState,
      nextState: workflow.nextState,
    }

    this.selectedWorkflow = newWorkflow;
    console.log(">>>", this.selectedWorkflow);
  }

  /**
 * @author Deivid Mafra;
 * @date 05/15/2020;
 * @remarks This method is responsible for fetching the PaymentState List from the endpoint.
 */
  getPaymentState = () => {
    let url = '/Payment/getPaymentStatusList';
    this.paymentService.getService(url).subscribe(
      res => {
        this.pStatesList = res.data;
        // console.log('this.pStatesList', this.pStatesList)
        // this.getStatesName(2);
      },
      err => {
        console.log(err);
      })
  }

  /**
 * @author Deivid Mafra;
 * @date 05/14/2020;
 * @param id - is a state id;
 * @remarks This method is responsible for allowing fetching the states name to show it on the workflow list.
 */
  getStatesName = (id) => {
    console.log('this.pStatesList', this.pStatesList);
    try {
      this.state = this.pStatesList.filter(state => state.id == id);
      console.log('this.state string', this.state)
    } catch (error) {
      return "error";
    }
    console.log('this.state[0].stateName', this.state[0].stateName)
    return this.state === undefined ? "got undefined" : this.state[0].stateName;
  }

  onChangePage(pageOfItems: Array<PaymentWorkflow>) {
    this.pageOfItems = pageOfItems;
  }

}
