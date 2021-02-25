import { GeneralService } from 'src/app/services/general.service';
import { Component, OnInit } from '@angular/core';
import { PaymentState } from 'src/app/models/paymentState';

@Component({
  selector: 'app-payment-state',
  templateUrl: './payment-state.component.html',
  styleUrls: ['./payment-state.component.css']
})
export class PaymentStateComponent implements OnInit {

  tableHeader: string[] = ['Payment State', 'Description', 'Edit'];

  public pStatesList: Array<PaymentState>;
  public pageOfItems: Array<PaymentState>;
  public selectedState: PaymentState;
  public table;

  constructor(private paymentService: GeneralService) { }

  ngOnInit() {
    this.getPaymentState();
  }

  /**
   * @author Deivid Mafra;
   * @date 05/14/2020;
   * @remarks This method is responsible for fetching the PaymentState List from the endpoint.
   */
  getPaymentState = () => {
    let url = '/Payment/getPaymentStatusList';
    this.paymentService.getService(url).subscribe(
      res => {
        this.pStatesList = res.data;
        console.log('this.pStatesList', this.pStatesList)
      },
      err => {
        console.log(err);
      })
  }

  /**
   * @author Deivid Mafra;
   * @date 05/14/2020;
   * @param state - is a complete PayemntState object;
   * @remarks This method is responsible for allowing the end-user select a PaymentState to edit by clicking on that in the table.
   */
  selectState(state: PaymentState) {
    this.selectedState = state;
    console.log(">>>", this.selectedState);
  }
  onChangePage(pageOfItems: Array<PaymentState>) {
    this.pageOfItems = pageOfItems;
  }

}
