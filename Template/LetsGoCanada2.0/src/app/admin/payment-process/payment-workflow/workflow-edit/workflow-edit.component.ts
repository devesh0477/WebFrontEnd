import { PaymentWorkflow } from './../../../../models/paymentWorkflow';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { showNotification } from 'src/app/toast-message/toast-message';
import { PaymentState } from 'src/app/models/paymentState';

@Component({
  selector: 'app-workflow-edit',
  templateUrl: './workflow-edit.component.html',
  styleUrls: ['./workflow-edit.component.css']
})
export class WorkflowEditComponent implements OnInit {

  constructor(private paymentService: GeneralService) { }

  @Input() workflowToEdit: PaymentWorkflow;
  @Input() workflows: Array<PaymentWorkflow>;
  @Output() newWorkflowList: EventEmitter<Array<PaymentWorkflow>> = new EventEmitter();
  public stateList: PaymentState;
  public spinner: boolean = false;

  workflowForm = new FormGroup({
    id: new FormControl(null, Validators.required), //only for send to database
    curentState: new FormControl('', Validators.required),
    nextState: new FormControl('', Validators.required)
  });

  ngOnInit() {
    this.getState();
  }

  ngOnChanges() {
    if (this.workflowToEdit)
      this.fillForm();
  }
  fillForm = () => {
    this.workflowForm.get('id').setValue(this.workflowToEdit.id);
    this.workflowForm.get('curentState').setValue(this.workflowToEdit.curentState);
    this.workflowForm.get('nextState').setValue(this.workflowToEdit.nextState);
  }

  /**
 * @author Deivid Mafra;
 * @date 05/14/2020;
 * @remarks This method is responsible for submit the data from the form to the end-point creating or updating a PaymentWorkflow based on if the id field is empty or not.
 */
  getState = () => {
    let url = '/Payment/getPaymentStatusList';
    this.paymentService.getService(url).subscribe(
      res => {
        this.stateList = res.data;
      },
      err => {
        console.log('err', err);
      }
    )
  }


  /**
   * @author Deivid Mafra;
   * @date 05/14/2020;
   * @remarks This method is responsible for submit the data from the form to the end-point creating or updating a PaymentWorkflow based on if the id field is empty or not.
   */
  onSubmit = () => {
    if (!this.workflowForm.get('curentState').value || !this.workflowForm.get('nextState').value) {
      showNotification('top', 'right', 'warning', 'Please fill all fields before click on submit.');
    } else {

      var data: PaymentWorkflow;
      let url: string = '/Payment/setPaymentWorkflow';

      if (typeof this.workflowForm.get('id').value === undefined || this.workflowForm.get('id').value == null) {
        data = {
          "id": 0,
          "curentState": this.workflowForm.get('curentState').value,
          "nextState": this.workflowForm.get('nextState').value,
        }

        let registered = false; // Search for a way to avoid duplicated register.

        if (registered) {
          showNotification('top', 'right', 'danger', 'Payment Workflow already registered.');
        } else {
          this.spinner = true;
          this.paymentService.post(url, data).subscribe(
            (res) => {
              if (res.message == 'Ok') {
                let newWorkflow: PaymentWorkflow = {
                  "id": res.data[0].id,
                  "curentState": res.data[0].curentState,
                  "nextState": res.data[0].nextState,
                }
                this.workflows.unshift(newWorkflow);
                this.newWorkflowList.emit(this.workflows);
                this.clearField();
                this.spinner = false;
                showNotification('top', 'right', 'success', 'Payment Workflow registered successfully!');
              }
              (err) => {
                console.log(err)
                this.spinner = false;
                showNotification('top', 'right', 'danger', 'Error trying to register the new Payment Workflow!');
              }
            }
          )
        }
      } else {
        this.spinner = true;
        data = this.workflowForm.value;

        let index: number = this.workflows.findIndex((workflow: PaymentWorkflow) => workflow.id === this.workflowForm.get('id').value);

        this.paymentService.post(url, data).subscribe(
          (res) => {
            if (res.message == 'Ok') {
              this.workflows[index] = res.data[0];
              this.newWorkflowList.emit(this.workflows);
              this.clearField();
              this.spinner = false;
              showNotification('top', 'right', 'success', 'Payment Workflow updated successfully!');
            }
            (err) => {
              console.log(err);
              this.spinner = false;
              showNotification('top', 'right', 'danger', 'Error trying to register the new Payment Workflow!');
            }
          }
        )
      }
    }
  }

  clearField = () => {
    this.workflowForm.reset();
  }

}