import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { ActivatedRoute } from '@angular/router';
import { NgModel } from '@angular/forms';
import { Application } from 'src/app/models/applicantion';
import { showNotification } from 'src/app/toast-message/toast-message';

declare const $: any;

@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.css']
})
export class ProgramsComponent implements OnInit {


  id: string;
  name: string;
  programsSearch: string[];
  schoolsSearch: string[];
  selectedIntakes: string[];
  programIntakes: string[];
  selectedLevels: string[];
  programLevels: string[];
  selectedDisciplines: string[];
  programDisciplines: string[];
  programId: string;
  terms: string[];
  applicantId: number;
  newApplication: Application;
  programPerTermId: number;


  @ViewChild('searchModal') searchInput: ElementRef;
  applicantString: string = " ";
  applicantResult: string[];

  constructor(private schoolsService: GeneralService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getSchoolId();
    this.getProgram();
    this.getProgramFilterOptions();
  }

  deselectAll(intake: NgModel, level: NgModel, discipline: NgModel) {
    intake.update.emit([]);
    level.update.emit([]);
    discipline.update.emit([]);
  }

  getSchoolId() {
    return this.id = this.route.snapshot.paramMap.get('id');
  }

  /**
   * @author Deivid Mafra;
   * @date 09/17/2019;
   * @remarks this method returns the id and triggers the getTermsById function.
   */
  getProgramId(id: string) {
    this.programId = id;
    // console.log("this.programId", this.programId)s
    this.getTermsById();
  }

  /**
   * @author Deivid Mafra;
   * @date 09/17/2019;
   * @remarks this method returns the terms by chosen id.
   */
  getTermsById() {
    let url: string = '/School/getProgramDetails/' + this.programId;
    this.schoolsService.getService(url).subscribe(
      (res) => {
        // this.terms = res.data;
        this.terms = res.data[0].programsPerTerm;
        console.log("this.programPerTerm>>>", this.terms)
      },
      (err) => {
        console.log(err);
      })
  }

  /**
   * @author Deivid Mafra;
   * @date 08/27/2019;
   * @remarks I have to check if it's duplicated with getProgram method.
   */
  searchProgram() {

    let url: string = '/School/getProgramSearch/';

    let data = {
      "schoolId": [this.id],
      "ProgramLevel": this.selectedLevels,
      "Intakes": this.selectedIntakes,
      "Discipline": this.selectedDisciplines
    }

    this.schoolsService.post(url, data).subscribe(
      (res) => {
        if (!res.data[0]) {
          showNotification('top', 'right', 'danger', 'There is no program for this selection!');
          this.selectedLevels = [];
          this.selectedIntakes = [];
          this.selectedDisciplines = [];

        } else {
          this.programsSearch = res.data[0].school[0].programs;
          this.name = res.data[0].school[0].name;
        }
      },
      (err) => {
        console.log(err);
      })
  }

  /**
   * @author Deivid Mafra;
   * @date 10/03/2019;
   * @remarks This method returns a specific program based on the selection made by the end-user.
   */
  getProgram() {

    let url: string = '/School/getProgramSearch/';

    let data = {
      "schoolId": [this.id],
      "ProgramLevel": this.selectedLevels,
      "Intakes": this.selectedIntakes,
      "Discipline": this.selectedDisciplines
    }

    this.schoolsService.post(url, data).subscribe(
      (res) => {
        this.programsSearch = res.data[0].school[0].programs;
        this.name = res.data[0].school[0].name;
        // console.log("this.programsSearch", this.programsSearch)

      },
      (err) => {
        console.log(err);
      })
  }

  /**
   * @author Deivid Mafra;
   * @date 08/16/2019;
   * @remarks This method returns a program list
   */
  getProgramFilterOptions() {
    let url: string = '/School/getProgramFilterOptions/';
    let data = {
      "programLevel": [],
      "Intakes": [],
      "Discipline": []
    }
    this.schoolsService.post(url, data).subscribe(
      (res) => {
        this.programDisciplines = res.data.discipline;
        this.programIntakes = res.data.intakes;
        this.programLevels = res.data.programLevel;
      },
      (err) => {
        console.log(err);
      })
  }
}
