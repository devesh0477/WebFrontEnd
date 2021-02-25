import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Discipline } from 'src/app/models/discipline';
import { GeneralService } from 'src/app/services/general.service';
import { showNotification } from 'src/app/toast-message/toast-message';

@Component({
  selector: 'app-discipline',
  templateUrl: './discipline.component.html',
  styleUrls: ['./discipline.component.css']
})
export class DisciplineComponent implements OnInit {

  constructor(private disciplineService: GeneralService) { }

  //Type School form fields

  disciplineForm = new FormGroup({
    disciplineId: new FormControl(null, Validators.required), //only for send to database
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required)
  });

  public tableHeader: String[];
  public discipline: Array<Discipline>;
  public pageOfItems: Array<Discipline>;

  ngOnInit() {
    this.tableHeader = ['Discipline', 'Description', 'Edit'];
    this.getDiscipline();
  }

  getDiscipline() {
    let url = "/admin/getDisciplineList";
    this.disciplineService.getService(url).subscribe(
      (res) => {
        this.discipline = res.data;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  selectDiscipline(discipline: Discipline) {
    this.disciplineForm.get('disciplineId').setValue(discipline.disciplineId);
    this.disciplineForm.get('name').setValue(discipline.name);
    this.disciplineForm.get('description').setValue(discipline.description);
    console.log("****", this.disciplineForm.get('disciplineId').value)
  }

  onSubmit() {
    var data: Discipline;
    let url: string = '/admin/setDiscipline';

    if (typeof this.disciplineForm.get('disciplineId').value === undefined || this.disciplineForm.get('disciplineId').value == null) {
      data = {
        "disciplineId": 0,
        "name": this.disciplineForm.get('name').value,
        "description": this.disciplineForm.get('description').value
      }
      //to create a new Discipline
      this.disciplineService.post(url, data).subscribe(
        (res) => {
          console.log("Discipline New>>>>", res.data[0]);
          if (res.message == 'Ok')
            showNotification('top', 'right', 'success', 'New discipline registered successfully!');
          this.pageOfItems.unshift(res.data[0]);
          this.clearField();
        },
        (err) => {
          console.log(err)
          showNotification('top', 'right', 'danger', 'Error trying to register the new Discipline!');
        })

    } else {
      data = this.disciplineForm.value;
      console.log(data);
      //To update a Discipline

      let index: number = this.discipline.findIndex((discipline: any) => discipline.disciplineId === this.disciplineForm.get('disciplineId').value);

      this.disciplineService.post(url, data).subscribe(
        (res) => {
          console.log("Discipline index>>>>", index);
          console.log("Discipline update>>>>", res.data[0]);
          if (res.message == 'Ok')
            showNotification('top', 'right', 'success', 'Discipline updated successfully!');
          this.pageOfItems[index] = res.data[0];
          this.clearField();
        },
        (err) => {
          console.log(err)
          showNotification('top', 'right', 'danger', 'Error trying to update the discipline!')
        })
    }
  }

  onChangePage(pageOfItems: Array<Discipline>) {
    this.pageOfItems = pageOfItems;
  }

  clearField() {
    this.disciplineForm.reset();
    console.log(">>>>>>", this.disciplineForm.value);
  }

}