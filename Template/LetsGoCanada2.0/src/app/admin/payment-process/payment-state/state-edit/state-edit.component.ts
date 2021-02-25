import { PaymentState } from './../../../../models/paymentState';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { showNotification } from 'src/app/toast-message/toast-message';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-state-edit',
  templateUrl: './state-edit.component.html',
  styleUrls: ['./state-edit.component.css']
})
export class StateEditComponent implements OnInit {

  constructor(private paymentService: GeneralService) { }

  @Input() stateToEdit: PaymentState;
  @Input() states: Array<PaymentState>;
  @Output() newStatesList: EventEmitter<Array<PaymentState>> = new EventEmitter();
  public spinner: boolean = false;

  stateForm = new FormGroup({
    id: new FormControl(null, Validators.required), //only for send to database
    stateName: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  ngOnInit() {
  }

  ngOnChanges() {
    console.log("<<<", this.stateToEdit)
    if (this.stateToEdit)
      this.fillForm();
  }
  fillForm = () => {
    this.stateForm.get('id').setValue(this.stateToEdit.id);
    this.stateForm.get('stateName').setValue(this.stateToEdit.stateName);
    this.stateForm.get('description').setValue(this.stateToEdit.description);
  }

  /**
   * @author Deivid Mafra;
   * @date 05/14/2020;
   * @remarks This method is responsible for submit the data from the form to the end-point creating or updating a PaymentState based on if the id field is empty or not.
   */
  onSubmit = () => {
    if (!this.stateForm.get('stateName').value) {
      showNotification('top', 'right', 'warning', 'Please fill the State Name field before click on the button.');
    } else {

      var data: PaymentState;
      let url: string = '/Payment/setPaymentState';

      if (typeof this.stateForm.get('id').value === undefined || this.stateForm.get('id').value == null) {
        data = {
          "id": 0,
          "stateName": this.stateForm.get('stateName').value,
          "description": this.stateForm.get('description').value,
        }

        let registered = this.states.some(state => state.stateName.toLowerCase() === this.stateForm.get('stateName').value.toLowerCase());

        if (registered) {
          showNotification('top', 'right', 'danger', 'Payment State already registered.');
        } else {
          this.spinner = true;
          this.paymentService.post(url, data).subscribe(
            (res) => {
              if (res.message == 'Ok') {
                let newState: PaymentState = {
                  id: res.data[0].id,
                  stateName: res.data[0].stateName,
                  description: res.data[0].description,
                }
                this.states.unshift(newState);
                this.newStatesList.emit(this.states);
                this.clearField();
                this.spinner = false;
                showNotification('top', 'right', 'success', 'Payment State registered successfully!');
              }
              (err) => {
                console.log(err)
                this.spinner = false;
                showNotification('top', 'right', 'danger', 'Error trying to register the new Payment State!');
              }
            }
          )
        }
      } else {
        this.spinner = true;
        data = this.stateForm.value;

        let index: number = this.states.findIndex((states: any) => states.id === this.stateForm.get('id').value);

        this.paymentService.post(url, data).subscribe(
          (res) => {
            if (res.message == 'Ok') {
              this.states[index] = res.data[0];
              this.newStatesList.emit(this.states);
              this.clearField();
              this.spinner = false;
              showNotification('top', 'right', 'success', 'Payment State updated successfully!');
            }
            (err) => {
              console.log(err)
              this.spinner = false;
              showNotification('top', 'right', 'danger', 'Error trying to register the new Payment State!');
            }
          }
        )
      }
    }
  }

  clearField = () => {
    this.stateForm.reset();
  }

}
