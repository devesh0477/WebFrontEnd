import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Terms } from 'src/app/models/term';
import { GeneralService } from 'src/app/services/general.service';
import { showNotification } from 'src/app/toast-message/toast-message';

@Component({
  selector: 'app-term',
  templateUrl: './term.component.html',
  styleUrls: ['./term.component.css']
})
export class TermComponent implements OnInit {

  constructor(private termService: GeneralService) { }

  //Term form fields
  termForm = new FormGroup({
    termId: new FormControl(null, Validators.required), //only for send to database
    year: new FormControl('', Validators.required),
    season: new FormControl('', Validators.required)
  });

  public tableHeader: String[];
  public terms: Array<Terms>;
  public pageOfItems: Array<Terms>;

  ngOnInit() {
    this.tableHeader = ['Season', 'Year', 'Edit'];
    this.getTerms();
  }

  getTerms() {
    let url = "/admin/getTermList";
    this.termService.getService(url).subscribe(
      (res) => {
        this.terms = res.data;
      },
      (err) => {
        console.log(err);
      }
    )
  }

  selectTerm(term: Terms) {
    this.termForm.get('termId').setValue(term.termId);
    this.termForm.get('year').setValue(term.year);
    this.termForm.get('season').setValue(term.season);
    console.log("****", this.termForm.get('termId').value)
  }

  onSubmit() {
    var data: Terms;
    let url: string = '/admin/setTerm';

    if (typeof this.termForm.get('termId').value === undefined || this.termForm.get('termId').value == null) {
      data = {
        "termId": 0,
        "year": this.termForm.get('year').value,
        "season": this.termForm.get('season').value
      }
      //to create a new Term
      this.termService.post(url, data).subscribe(
        (res) => {
          console.log("terms New>>>>", res.data[0]);
          if (res.message == 'Ok')
            showNotification('top', 'right', 'success', 'New term registered successfully!');
          this.pageOfItems.unshift(res.data[0]);
          this.clearField();
        },
        (err) => {
          console.log(err)
          showNotification('top', 'right', 'danger', 'Error trying to register the new term!');
        })

    } else {
      data = this.termForm.value;
      console.log(data);
      //To update a Term

      let index: number = this.terms.findIndex((terms: any) => terms.termId === this.termForm.get('termId').value);

      this.termService.post(url, data).subscribe(
        (res) => {
          console.log("terms index>>>>", index);
          console.log("terms update>>>>", res.data[0]);
          if (res.message == 'Ok')
            showNotification('top', 'right', 'success', 'Term updated successfully!');
          this.pageOfItems[index] = res.data[0];
          this.clearField();
        },
        (err) => {
          console.log(err)
          showNotification('top', 'right', 'danger', 'Error trying to update the term!')
        })
    }
  }

  onChangePage(pageOfItems: Array<Terms>) {
    this.pageOfItems = pageOfItems;
  }

  clearField() {
    this.termForm.reset();
    console.log(">>>>>>", this.termForm.value);
  }

}
