import { Program } from 'src/app/models/program';
import { GeneralService } from 'src/app/services/general.service';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { showNotification } from 'src/app/toast-message/toast-message';
import { ComunicationService } from 'src/app/services/comunication.service';
import { isNullOrUndefined } from 'util';

@Component({
  selector: 'app-campus-program-edit',
  templateUrl: './campus-program-edit.component.html',
  styleUrls: ['./campus-program-edit.component.css']
})
export class CampusProgramEditComponent implements OnInit {

  public schoolPrograms: Array<Program>;
  @Input() programs: Array<any>;
  @Output() newProgramsList: EventEmitter<Array<any>> = new EventEmitter();

  public whosWorking: string = '';

  addProgramForm = new FormGroup({
    Id: new FormControl(null),
    programId: new FormControl(null, Validators.required),
    campusId: new FormControl(null),
    specialName: new FormControl(null),

    //specialName: new FormControl(''),

  });

  private schoolId;

  constructor(private campusService: GeneralService, private route: ActivatedRoute, private communication: ComunicationService) {

  }

  ngOnInit() {

    this.getProgramListBySchool();
  }

  /**
   * Method to define the accion to show the spinner.
   * @param paramet 
   * @author Diego.Perez
   * @date 12/14/2020
   */
  onPopUpDoing(paramet: string) {
    if (!isNullOrUndefined(paramet) && paramet == this.whosWorking) {
      return true;
    } else {
      return false;
    }
  }

  getProgramListBySchool = () => {
    let url: string = '/School/getProgramSearch/';

    let data = {
      "schoolId": [localStorage.getItem('schoolId')],
      "programLevel": [],
      "Intakes": [],
      "Discipline": [],
      "province": [],
      "city": [],
    }
    this.campusService.post(url, data).subscribe(
      res => {
        this.schoolPrograms = res.data[0].school[0].programs;
        //console.log('this.schoolPrograms', this.schoolPrograms);
      },
      err => {
        console.log(err);
      }
    )
  }

  getCampusId = () => {

    return parseInt(this.route.snapshot.paramMap.get('id'));

  }

  clearField() {
    this.addProgramForm.reset();
  }

  onSubmit() {
    if (!this.addProgramForm.valid) {
      showNotification('top', 'right', 'warning', 'Please check all form fields in red.');
    } else {

      var data;
      let url: string = '/school/postCampusProgram';

      if (typeof this.addProgramForm.get('Id').value === undefined || this.addProgramForm.get('Id').value == null) {
        data = {
          "Id": 0,
          "programId": this.addProgramForm.get('programId').value,
          "campusId": this.getCampusId(),
          "specialName": this.addProgramForm.get('specialName').value,
        }    

        let nameInUse = this.programs.some(programs => programs.specialName.toLowerCase() === this.addProgramForm.get('specialName').value.toLowerCase());

        let registered = this.programs.some(programs => programs.programId == this.addProgramForm.get('programId'));
        if (registered) {
          return showNotification('top', 'right', 'danger', 'Program already registered.');
        }

        if (data.specialName !== null) {
          let nameInUse = this.programs.some(programs => programs.specialName.toLowerCase() === this.addProgramForm.get('specialName').value.toLowerCase());
          if (nameInUse) {
            return showNotification('top', 'right', 'danger', 'Please choose a different special name. Special name already registered.');
          }

        } else {
          this.whosWorking = 'submit';
          this.campusService.post(url, data).subscribe(
            res => {

              console.log('res', res);
              // if (res.message == 'Ok') {
              showNotification('top', 'right', 'success', 'Program addeded successfully!');

              // this.communication.sendProcess(res);
              this.clearField();
              this.whosWorking = '';
            },
            error => {
              console.log(error.error.message);
              this.whosWorking = '';
              if (error.error.message == 'Problem creating the record') {
                showNotification('top', 'right', 'danger', 'Program already registred for this campus!');
              } else
                showNotification('top', 'right', 'danger', 'Error trying to add the new program!');
            }

          )
        }

        this.whosWorking = 'submit';
        this.campusService.post(url, data).subscribe(
          res => {
            showNotification('top', 'right', 'success', 'Program addeded successfully!');

            this.communication.sendProcess(res);

            this.clearField();
            this.whosWorking = '';
          },
          error => {
            // console.log(error.error.message);
            this.whosWorking = '';
            if (error.error.message == 'Problem creating the record') {
              showNotification('top', 'right', 'danger', 'Program already registred for this campus!');
            } else
              showNotification('top', 'right', 'danger', 'Error trying to add the new program!');
          }
        )
      }
    }
  }
}
