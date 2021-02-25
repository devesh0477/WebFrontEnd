import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { TypeProgram } from 'src/app/models/typeProgram';
import { GeneralService } from 'src/app/services/general.service';
import { showNotification } from 'src/app/toast-message/toast-message';

@Component({
  selector: 'app-type-of-program',
  templateUrl: './type-of-program.component.html',
  styleUrls: ['./type-of-program.component.css']
})
export class TypeOfProgramComponent implements OnInit {

  constructor(private typeProgramService: GeneralService) { }

  //Type School form fields

  typeProgramForm = new FormGroup({
    typeOfProgramId: new FormControl(null, Validators.required), //only for send to database
    name: new FormControl('', Validators.required),
  });

  public tableHeader: String[];
  public typeProgram: Array<TypeProgram>;
  public pageOfItems: Array<TypeProgram>;

  ngOnInit() {
    this.tableHeader = ['Program Description', 'Edit'];
    this.getTypeProgram();
  }

  getTypeProgram() {
    let url = "/admin/getTypeOfProgramList";
    this.typeProgramService.getService(url).subscribe(
      (res) => {
        this.typeProgram = res.data;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  selectTypeProgram(TypeProgram: TypeProgram) {
    this.typeProgramForm.get('typeOfProgramId').setValue(TypeProgram.typeOfProgramId);
    this.typeProgramForm.get('name').setValue(TypeProgram.name);
    console.log("****", this.typeProgramForm.get('typeOfProgramId').value)
  }

  onSubmit() {
    var data: TypeProgram;
    let url: string = '/admin/setTypeOfProgram';

    if (typeof this.typeProgramForm.get('typeOfProgramId').value === undefined || this.typeProgramForm.get('typeOfProgramId').value == null) {
      data = {
        "typeOfProgramId": 0,
        "name": this.typeProgramForm.get('name').value,
      }
      //to create a new TypeProgram
      this.typeProgramService.post(url, data).subscribe(
        (res) => {
          console.log("TypeProgram New>>>>", res.data[0]);
          if (res.message == 'Ok')
            showNotification('top', 'right', 'success', 'New type of program registered successfully!');
          this.pageOfItems.unshift(res.data[0]);
          this.clearField();
        },
        (err) => {
          console.log(err)
          showNotification('top', 'right', 'danger', 'Error trying to register the new type of program!');
        })

    } else {
      data = this.typeProgramForm.value;
      console.log(data);
      //To update a TypeProgram

      let index: number = this.typeProgram.findIndex((TypeProgram: any) => TypeProgram.typeOfProgramId === this.typeProgramForm.get('typeOfProgramId').value);

      this.typeProgramService.post(url, data).subscribe(
        (res) => {
          console.log("TypeProgram index>>>>", index);
          console.log("TypeProgram update>>>>", res.data[0]);
          if (res.message == 'Ok')
            showNotification('top', 'right', 'success', 'Type of program updated successfully!');
          this.pageOfItems[index] = res.data[0];
          this.clearField();
        },
        (err) => {
          console.log(err)
          showNotification('top', 'right', 'danger', 'Error trying to update the type of program!')
        })
    }
  }

  onChangePage(pageOfItems: Array<TypeProgram>) {
    this.pageOfItems = pageOfItems;
  }

  clearField() {
    this.typeProgramForm.reset();
    console.log(">>>>>>", this.typeProgramForm.value);
  }

}
