import { EduType } from './../../../../models/eduType';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { showNotification } from 'src/app/toast-message/toast-message';

@Component({
  selector: 'app-education-edit',
  templateUrl: './education-edit.component.html',
  styleUrls: ['./education-edit.component.css']
})
export class EducationEditComponent implements OnInit {

  constructor(private eduTypeService: GeneralService) { }

  @Input() eduTypeToEdit: EduType;
  @Input() eduTypes: Array<EduType>;
  @Output() newEduTypeList: EventEmitter<Array<EduType>> = new EventEmitter();
  public spinner: boolean = false;

  eduTypeForm = new FormGroup({
    educationTypeId: new FormControl(null, Validators.required), //only for send to database
    name: new FormControl('', Validators.required),
    levelName: new FormControl('', Validators.required)
  });

  ngOnInit() {
  }

  ngOnChanges() {
    if (this.eduTypeToEdit)
      this.fillForm();
  }
  fillForm() {
    this.eduTypeForm.get('educationTypeId').setValue(this.eduTypeToEdit.educationTypeId);
    this.eduTypeForm.get('name').setValue(this.eduTypeToEdit.name);
    this.eduTypeForm.get('levelName').setValue(this.eduTypeToEdit.levelName)
  }

  /**
   * @author Deivid Mafra;
   * @date 04/23/2020;
   * @remarks This method is responsible for submit the data from the form to the end-point creating or updating an Education Type
   */
  onSubmit() {
    if (!this.eduTypeForm.get('name').value || !this.eduTypeForm.get('levelName').value) {
      showNotification('top', 'right', 'warning', 'Please fill all form fields.');
    } else {

      var data;
      let url: string = '/admin/setEducationType';

      if (typeof this.eduTypeForm.get('educationTypeId').value === undefined || this.eduTypeForm.get('educationTypeId').value == null) {
        data = {
          "EducationTypeID": 0,
          "Name": this.eduTypeForm.get('name').value,
          "LevelName": this.eduTypeForm.get('levelName').value
        }

        let registered = this.eduTypes.some(country => country.name.toLowerCase() === this.eduTypeForm.get('name').value.toLowerCase());

        if (registered) {
          showNotification('top', 'right', 'danger', 'Education Type already registered.');
        } else {
          this.spinner = true;
          this.eduTypeService.post(url, data).subscribe(
            (res) => {
              if (res.message == 'Ok') {
                this.eduTypes.unshift(res.data[0]);
                this.newEduTypeList.emit(this.eduTypes);
                this.clearField();
                this.spinner = false;
                showNotification('top', 'right', 'success', 'Education Type registered successfully!');
              }
              (err) => {
                console.log(err)
                this.spinner = false;
                showNotification('top', 'right', 'danger', 'Error trying to register the new country!');
              }
            }
          )
        }
      } else {
        this.spinner = true;
        data = this.eduTypeForm.value;
        let index: number = this.eduTypes.findIndex((eduTypes: any) => eduTypes.educationTypeId === this.eduTypeForm.get('educationTypeId').value);

        this.eduTypeService.post(url, data).subscribe(
          (res) => {
            if (res.message == 'Ok') {
              this.eduTypes[index] = res.data[0];
              this.newEduTypeList.emit(this.eduTypes);
              this.clearField();
              this.spinner = false;
              showNotification('top', 'right', 'success', 'Education Type updated successfully!');
            }
            (err) => {
              console.log(err);
              this.spinner = false;
              showNotification('top', 'right', 'danger', 'Error trying to register the new education type!');
            }
          }
        )
      }
    }
  }

  clearField() {
    this.eduTypeForm.reset();
  }
}