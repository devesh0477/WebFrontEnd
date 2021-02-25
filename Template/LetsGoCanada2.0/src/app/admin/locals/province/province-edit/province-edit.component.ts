import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { showNotification } from 'src/app/toast-message/toast-message';
import { GeneralService } from 'src/app/services/general.service';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Province } from 'src/app/models/province';
import { Country } from 'src/app/models/country';

@Component({
  selector: 'app-province-edit',
  templateUrl: './province-edit.component.html',
  styleUrls: ['./province-edit.component.css']
})
export class ProvinceEditComponent implements OnInit {

  constructor(private provinceService: GeneralService) { }

  @Input() provinceToEdit: Province;
  @Input() countries: Array<Country>;
  @Input() provinces: Array<Province>;
  @Output() newProvinceList: EventEmitter<Array<Province>> = new EventEmitter();

  provinceForm = new FormGroup({
    provinceId: new FormControl(null, Validators.required), //only for send to database
    countryId: new FormControl('', Validators.required),
    name: new FormControl('', Validators.required)
  });

  ngOnInit() {
  }
  ngOnChanges() {
    // console.log(">>>", this.provinceToEdit)
    if (this.provinceToEdit)
      this.fillForm();
  }

  fillForm() {
    this.provinceForm.get('provinceId').setValue(this.provinceToEdit.provinceId);
    this.provinceForm.get('countryId').setValue(this.provinceToEdit.countryId);
    this.provinceForm.get('name').setValue(this.provinceToEdit.name);
  }

  /**
 * @author Deivid Mafra;
 * @date 02/16/2020;
 * @remarks This method is responsible for submit the data from the form to the end-point creating or updating a Country
 */
  onSubmit() {
    if (!this.provinceForm.get('name').value || !this.provinceForm.get('countryId').value) {
      showNotification('top', 'right', 'warning', 'Please fill all form fields.');
    } else {

      var data: Province;
      let url: string = '/admin/setProvince';

      if (typeof this.provinceForm.get('provinceId').value === undefined || this.provinceForm.get('provinceId').value == null) {
        data = {
          "provinceId": 0,
          "countryId": this.provinceForm.get('countryId').value,
          "name": this.provinceForm.get('name').value
        }

        let registered = this.provinces.some(province => province.name.toLowerCase() === this.provinceForm.get('name').value.toLowerCase());

        if (registered) {
          showNotification('top', 'right', 'danger', 'Province already registered.');
        } else {
          this.provinceService.post(url, data).subscribe(
            (res) => {
              if (res.message == 'Ok') {
                this.provinces.unshift(res.data[0]);
                this.newProvinceList.emit(this.provinces);
                this.clearField();
                showNotification('top', 'right', 'success', 'Province registered successfully!');
              }
              (err) => {
                console.log(err)
                showNotification('top', 'right', 'danger', 'Error trying to register the new province!');
              }
            }
          )
        }
      } else {
        data = this.provinceForm.value;

        let index: number = this.provinces.findIndex((provinces: any) => provinces.provinceId === this.provinceForm.get('provinceId').value);
        console.log("***", index);

        this.provinceService.post(url, data).subscribe(
          (res) => {
            if (res.message == 'Ok') {
              this.provinces[index] = res.data[0];
              this.newProvinceList.emit(this.provinces);
              this.clearField();
              showNotification('top', 'right', 'success', 'Province updated successfully!');
            }
            (err) => {
              console.log(err)
              showNotification('top', 'right', 'danger', 'Error trying to register the new province!');
            }
          }
        )
      }
    }
  }

  clearField() {
    this.provinceForm.reset();
    console.log(">>>>>>", this.provinceForm.value);
  }
}
