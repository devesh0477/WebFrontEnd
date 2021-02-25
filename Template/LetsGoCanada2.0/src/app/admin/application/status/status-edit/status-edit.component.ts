import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { showNotification } from 'src/app/toast-message/toast-message';
import { GeneralService } from 'src/app/services/general.service';
import { Status } from 'src/app/models/status';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-status-edit',
  templateUrl: './status-edit.component.html',
  styleUrls: ['./status-edit.component.css']
})
export class StatusEditComponent implements OnInit {

  constructor(private statusService: GeneralService) { }

  @Input() statusToEdit: Status;
  @Input() status: Array<Status>;
  @Output() newStatusList: EventEmitter<Array<Status>> = new EventEmitter();
  public spinner: boolean = false;

  statusForm = new FormGroup({
    statusId: new FormControl(null, Validators.required), //only for send to database
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.statusToEdit)
      this.fillForm();
  }
  fillForm() {
    this.statusForm.get('statusId').setValue(this.statusToEdit.statusId);
    this.statusForm.get('name').setValue(this.statusToEdit.name);
    this.statusForm.get('description').setValue(this.statusToEdit.description)
  }

  /**
   * @author Deivid Mafra;
   * @date 04/24/2020;
   * @remarks This method is responsible for submit the data from the form to the end-point creating or updating an Status
   */
  onSubmit() {
    if (!this.statusForm.get('name').value || !this.statusForm.get('description').value) {
      showNotification('top', 'right', 'warning', 'Please fill all form fields.');
    } else {

      var data;
      let url: string = '/admin/setStatus';

      if (typeof this.statusForm.get('statusId').value === undefined || this.statusForm.get('statusId').value == null) {
        data = {
          "statusId": 0,
          "name": this.statusForm.get('name').value,
          "description": this.statusForm.get('description').value
        }

        let registered = this.status.some(status => status.name.toLowerCase() === this.statusForm.get('name').value.toLowerCase());

        if (registered) {
          showNotification('top', 'right', 'danger', 'Status already registered.');
        } else {
          this.spinner = true;
          this.statusService.post(url, data).subscribe(
            (res) => {
              if (res.message == 'Ok') {
                this.status.unshift(res.data[0]);
                this.newStatusList.emit(this.status);
                this.clearField();
                this.spinner = false;
                showNotification('top', 'right', 'success', 'Status registered successfully!');
              }
              (err) => {
                console.log(err)
                this.spinner = false;
                showNotification('top', 'right', 'danger', 'Error trying to register the new status!');
              }
            }
          )
        }
      } else {
        this.spinner = true;
        data = this.statusForm.value;

        let index: number = this.status.findIndex((status: any) => status.statusId === this.statusForm.get('statusId').value);

        this.statusService.post(url, data).subscribe(
          (res) => {
            if (res.message == 'Ok') {
              this.status[index] = res.data[0];
              this.newStatusList.emit(this.status);
              this.clearField();
              this.spinner = false;
              showNotification('top', 'right', 'success', 'Status updated successfully!');
            }
            (err) => {
              console.log(err);
              this.spinner = false;
              showNotification('top', 'right', 'danger', 'Error trying to register the new status!');
            }
          }
        )
      }
    }
  }

  clearField() {
    this.statusForm.reset();
  }
}
