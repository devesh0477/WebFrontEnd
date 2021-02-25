import { GeneralService } from './../../../services/general.service';
import { School } from './../../../models/school';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Program } from 'src/app/models/program';
import { showNotification } from 'src/app/toast-message/toast-message';
import { MatSelectChange } from '@angular/material';

interface Status {
  value: number;
  viewValue: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  searchForm = new FormGroup({
    school: new FormControl(''),
    program: new FormControl(''),
    applicationId: new FormControl(''),
    applicantId: new FormControl(''),
    stName: new FormControl(''),
    status: new FormControl(''),
    agency: new FormControl(''),
    agent: new FormControl(''),
    startDate: new FormControl(''),
    endDate: new FormControl(''),
  });

  public status: Status[];
  public schoolList: School[];
  public programList: Array<Program> = [];
  public agencyList: any[];
  public agentList: any[];
  private schoolId;

  @Output() newSearch: EventEmitter<String> = new EventEmitter();

  constructor(private dashboardService: GeneralService) { }

  ngOnInit() {
    this.getPaymentStatusList();
    this.getAgencyPerRole();
    this.getAgentPerRole();
    this.getSchoolNames();
    this.getProgramsPerSchool();
  }

  search() {
    this.newSearch.emit(this.searchForm.value);
    // console.log("Search string>>>", this.searchForm.value);
  }

  clearForm = () => {
    // this.searchForm.reset();
    this.searchForm = new FormGroup({
      school: new FormControl(''),
      program: new FormControl(''),
      applicationId: new FormControl(''),
      applicantId: new FormControl(''),
      stName: new FormControl(''),
      status: new FormControl(''),
      agency: new FormControl(''),
      agent: new FormControl(''),
      startDate: new FormControl(''),
      endDate: new FormControl(''),
    });
    this.schoolId = null;
    this.getProgramsPerSchool();
    this.newSearch.emit(this.searchForm.value);
  }

  getPaymentStatusList = () => {
    let url = '/Payment/getPaymentStatusList';

    this.dashboardService.getService(url).subscribe(
      res => {
        this.status = res.data;
        // console.log('this.status', this.status)
      },
      err => {
        console.log(err);
      }
    )
  }

  getAgencyPerRole = () => {
    let url = '/Agent/getAgencyPerRole';

    this.dashboardService.getService(url).subscribe(
      res => {
        this.agencyList = res.data;
      },
      err => {
        console.log(err);
      }
    )

  }

  getSchoolNames = () => {
    let url = '/School/getSchoolNames';

    this.dashboardService.getService(url).subscribe(
      res => {
        this.schoolList = res.data;
      },
      err => {
        console.log(err);
      }
    )

  }

  getAgentPerRole = () => {
    let url = '/Agent/getAgentPerRole';
    let data = {
      "idSet": []
    }
    this.dashboardService.post(url, data).subscribe(
      res => {
        this.agentList = res.data;
      },
      err => {
        console.log(err);
      }
    )
  }

  selectSchoolChange(id: MatSelectChange) {
    // console.log('id', id)
    this.schoolId = id;
    this.programList = [];
    this.getProgramsPerSchool();
  }

  getProgramsPerSchool = () => {
    let url: string = '/School/getProgramSearch/';

    let data = {
      "schoolId": this.schoolId == null ? [] : [this.schoolId],
      "programLevel": [],
      "Intakes": [],
      "Discipline": [],
      "province": [],
      "city": [],
    }

    this.dashboardService.post(url, data).subscribe(
      res => {

        for (let i = 0; i < res.data.length; i++) {
          for (let k = 0; k < res.data[i].school[0].programs.length; k++) {
            this.programList.push(res.data[i].school[0].programs[k]);
          }
        }
        // console.log('this.programList', this.programList)
        // console.log('res.data', res.data)

      },
      err => {
        console.log(err);
      }
    )
  }
}
