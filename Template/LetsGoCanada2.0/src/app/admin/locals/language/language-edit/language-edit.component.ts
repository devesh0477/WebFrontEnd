import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { Lang } from 'src/app/models/lang';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { showNotification } from 'src/app/toast-message/toast-message';

@Component({
  selector: 'app-language-edit',
  templateUrl: './language-edit.component.html',
  styleUrls: ['./language-edit.component.css']
})
export class LanguageEditComponent implements OnInit {

  constructor(private languageService: GeneralService) { }

  @Input() languageToEdit: Lang;
  @Input() languages: Array<Lang>;
  @Output() newLanguageList: EventEmitter<Array<Lang>> = new EventEmitter();

  languageForm = new FormGroup({
    languageId: new FormControl(null, Validators.required), //only for send to database
    name: new FormControl('', Validators.required),
  });

  ngOnInit() {
  }

  ngOnChanges() {
    // console.log(">>>", this.languageToEdit)
    if (this.languageToEdit)
      this.fillForm();
  }
  fillForm() {
    this.languageForm.get('languageId').setValue(this.languageToEdit.languageId);
    this.languageForm.get('name').setValue(this.languageToEdit.name);
  }

  /**
 * @author Deivid Mafra;
 * @date 02/16/2020;
 * @remarks This method is responsible for submit the data from the form to the end-point creating or updating a Language
 */
  onSubmit() {
    if (!this.languageForm.get('name').value) {
      showNotification('top', 'right', 'warning', 'Please fill the form field before click on the button.');
    } else {

      var data: Lang;
      let url: string = '/admin/setLanguage';

      if (typeof this.languageForm.get('languageId').value === undefined || this.languageForm.get('languageId').value == null) {
        data = {
          "languageId": 0,
          "name": this.languageForm.get('name').value,
        }

        let registered = this.languages.some(language => language.name.toLowerCase() === this.languageForm.get('name').value.toLowerCase());

        if (registered) {
          showNotification('top', 'right', 'danger', 'Language already registered.');
        } else {
          this.languageService.post(url, data).subscribe(
            (res) => {
              if (res.message == 'Ok') {
                this.languages.unshift(res.data[0]);
                this.newLanguageList.emit(this.languages);
                this.clearField();
                showNotification('top', 'right', 'success', 'Language registered successfully!');
              }
              (err) => {
                console.log(err)
                showNotification('top', 'right', 'danger', 'Error trying to register the new language!');
              }
            }
          )
        }
      } else {
        data = this.languageForm.value;

        let index: number = this.languages.findIndex((languages: any) => languages.languageId === this.languageForm.get('languageId').value);
        console.log("***", index);

        this.languageService.post(url, data).subscribe(
          (res) => {
            if (res.message == 'Ok') {
              this.languages[index] = res.data[0];
              this.newLanguageList.emit(this.languages);
              this.clearField();
              showNotification('top', 'right', 'success', 'language updated successfully!');
            }
            (err) => {
              console.log(err)
              showNotification('top', 'right', 'danger', 'Error trying to register the new language!');
            }
          }
        )
      }
    }
  }

  clearField() {
    this.languageForm.reset();
    console.log(">>>>>>", this.languageForm.value);
  }
}
