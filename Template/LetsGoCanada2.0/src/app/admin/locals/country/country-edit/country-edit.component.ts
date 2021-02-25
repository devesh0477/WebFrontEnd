import { Component, OnInit, Input, OnChanges, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Country } from 'src/app/models/country';
import { showNotification } from 'src/app/toast-message/toast-message';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-country-edit',
  templateUrl: './country-edit.component.html',
  styleUrls: ['./country-edit.component.css']
})
export class CountryEditComponent implements OnInit, OnChanges {

  constructor(private countryService: GeneralService) { }

  @Input() countryToEdit: Country;
  @Input() countries: Array<Country>;
  @Output() newCountriesList: EventEmitter<Array<Country>> = new EventEmitter();

  countryForm = new FormGroup({
    countryId: new FormControl(null, Validators.required), //only for send to database
    name: new FormControl('', Validators.required),
    phoneCode: new FormControl('', Validators.required)
  });

  ngOnInit() {
  }

  ngOnChanges() {
    // console.log(">>>", this.countryToEdit)
    if (this.countryToEdit)
      this.fillForm();
  }
  fillForm() {
    this.countryForm.get('countryId').setValue(this.countryToEdit.countryId);
    this.countryForm.get('name').setValue(this.countryToEdit.name);
    this.countryForm.get('phoneCode').setValue(this.countryToEdit.phoneCode)
  }

  /**
 * @author Deivid Mafra;
 * @date 02/16/2020;
 * @remarks This method is responsible for submit the data from the form to the end-point creating or updating a Country
 */
  onSubmit() {
    if (!this.countryForm.get('name').value || !this.countryForm.get('phoneCode').value) {
      showNotification('top', 'right', 'warning', 'Please fill all form fields.');
    } else {

      var data: Country;
      let url: string = '/admin/setCountry';

      if (typeof this.countryForm.get('countryId').value === undefined || this.countryForm.get('countryId').value == null) {
        data = {
          "countryId": 0,
          "name": this.countryForm.get('name').value,
          "phoneCode": this.countryForm.get('phoneCode').value
        }

        let registered = this.countries.some(country => country.name.toLowerCase() === this.countryForm.get('name').value.toLowerCase());

        if (registered) {
          showNotification('top', 'right', 'danger', 'Country already registered.');
        } else {
          this.countryService.post(url, data).subscribe(
            (res) => {
              if (res.message == 'Ok') {
                this.countries.unshift(res.data[0]);
                this.newCountriesList.emit(this.countries);
                this.clearField();
                showNotification('top', 'right', 'success', 'Country registered successfully!');
              }
              (err) => {
                console.log(err)
                showNotification('top', 'right', 'danger', 'Error trying to register the new country!');
              }
            }
          )
        }
      } else {
        data = this.countryForm.value;

        let index: number = this.countries.findIndex((countries: any) => countries.countryId === this.countryForm.get('countryId').value);
        console.log("***", index);

        this.countryService.post(url, data).subscribe(
          (res) => {
            if (res.message == 'Ok') {
              this.countries[index] = res.data[0];
              this.newCountriesList.emit(this.countries);
              this.clearField();
              showNotification('top', 'right', 'success', 'Country updated successfully!');
            }
            (err) => {
              console.log(err)
              showNotification('top', 'right', 'danger', 'Error trying to register the new country!');
            }
          }
        )
      }
    }
  }

  clearField() {
    this.countryForm.reset();
    console.log(">>>>>>", this.countryForm.value);
  }
}