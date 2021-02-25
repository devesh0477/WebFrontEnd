import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { NgModel } from '@angular/forms';
import { Program } from 'src/app/models/program';
import { Application } from 'src/app/models/applicantion';
import { Schoolm } from 'src/app/models/schoolm';
import { SchoolLogo } from 'src/app/models/schoolLogo';
import { showNotification } from 'src/app/toast-message/toast-message';
import { Applicant } from 'src/app/models/applicant';

@Component({
  selector: 'app-program-list',
  templateUrl: './program-list.component.html',
  styleUrls: ['./program-list.component.css']
})
export class ProgramListComponent implements OnInit {

  schoolNameList: Schoolm[] = [];
  selectedSchool: string[];

  selectedLevels: string[];
  selectedIntakes: string[];
  selectedDisciplines: String[];
  programIntakes: string[];
  programLevels: string[];
  programDisciplines: string[];
  terms: string[];
  programId: string;
  schoolsSearch;
  pageOfItems: Array<Program>;
  isTermClosed: boolean;
  name: string;
  applicant: Applicant;
  newApplication: Application;
  programPerTermId: number;
  @ViewChild('searchModal') searchInput: ElementRef;
  applicantString: string = " ";
  applicantResult: string[];

  schoolLogoList: SchoolLogo[] = [];
  schoolLogo: SchoolLogo;

  cities: string[];
  provinces: string[];
  selectedProvinces: number[];
  selectedCities: number[];

  public programCost;
  public programCostList;
  public showCost: boolean = false;
  public programIdList: number[];
  public hasPrograms;


  constructor(private programsService: GeneralService) { }

  ngOnInit() {
    this.newApplication = new Application();
    var applicantSession = JSON.parse(localStorage.getItem('session')).selfApplicant;
    if (applicantSession != null) {
      this.applicant = applicantSession;
    }
    this.searchProgram();
    this.getProgramFilterOptions();
    this.getCitiesNProvinces();
  }

  getCitiesNProvinces() {
    let url = "/School/getGeoList";
    this.programsService.getService(url).subscribe(
      (res) => {
        this.cities = res.data.city;
        // console.log("this.cities", this.cities);
        this.provinces = res.data.province;
        // console.log("this.provinces", this.provinces);
      },
      (err) => {
        console.log(err);
      }
    )
  }

  onChangePage(pageOfItems: Array<Program>) {
    this.pageOfItems = pageOfItems;
    // console.log("this.pageOfItems", this.pageOfItems)
  }

  /**
   * @author Deivid Mafra;
   * @date 09/13/2019;
   * @remarks this method allows the end-user show more programs from a specific school;
   * @param index It's representing the chosen school in a list.
   */
  showMore(index: number) {
    const card = document.getElementById('cardPrograms' + index);
    card.classList.add('setScroll');
    card.classList.remove('limitedHeight');
    const button1 = document.getElementById('buttonProgramsM' + index);
    const button2 = document.getElementById('buttonProgramsL' + index);
    button1.classList.add('buttonHide');
    button1.classList.remove('buttonShow');
    button2.classList.remove('buttonHide');
    button2.classList.add('buttonShow');
  }

  /**
   * @author Deivid Mafra;
   * @date 09/13/2019;
   * @remarks this method allows the end-user show less programs from a specific school;
   * @param index It's representing the chosen school in a list.
   */
  showLess(index: number) {
    const card = document.getElementById('cardPrograms' + index);
    card.classList.add('limitedHeight');
    card.classList.remove('setScroll');
    const button1 = document.getElementById('buttonProgramsM' + index);
    const button2 = document.getElementById('buttonProgramsL' + index);
    button2.classList.add('buttonHide');
    button2.classList.remove('buttonShow');
    button1.classList.remove('buttonHide');
    button1.classList.add('buttonShow');
  }


  deselectAll(intake: NgModel, level: NgModel, discipline: NgModel, cities: NgModel, provinces: NgModel, school: NgModel) {

    intake.update.emit([]);
    level.update.emit([]);
    discipline.update.emit([]);
    provinces.update.emit([]);
    cities.update.emit([]);

    school.update.emit([]);

  }

  getProgramFilterOptions() {
    let url: string = '/School/getProgramFilterOptions/';
    let data = {
      "programLevel": [],
      "Intakes": [],
      "Discipline": [],
      "province": [],
      "city": []
    }
    this.programsService.post(url, data).subscribe(
      (res) => {
        this.programDisciplines = res.data.discipline;
        this.programIntakes = res.data.intakes;
        this.programLevels = res.data.programLevel;
      },
      (err) => {
        console.log(err);
      })
  }

  getProgramId(id: string) {
    this.programId = id;
    // console.log("this.programId", this.programId)
    this.getTermsById();
  }


  getTermsById() {
    let url: string = '/School/getProgramDetails/' + this.programId;
    this.programsService.getService(url).subscribe(
      (res) => {
        this.terms = res.data[0].programsPerTerm;
        // console.log('this.terms', this.terms)
      },
      (err) => {
        console.log(err);
      })
  }

  searchProgram() {

    let url: string = '/School/getProgramSearch/';

    let data = {
      "schoolId": this.selectedSchool,
      "programLevel": this.selectedLevels,
      "Intakes": this.selectedIntakes,
      "Discipline": this.selectedDisciplines,
      "province": this.selectedProvinces,
      "city": this.selectedCities,
    }
    this.programsService.post(url, data).subscribe(
      (res) => {
        if (!res.data[0]) {

          showNotification('top', 'right', 'danger', 'There is no program for this selection!');
          this.schoolsSearch = [];

        } else
          this.schoolsSearch = res.data;

        this.schoolNameList[0] = new Schoolm();

        const schoolListSize = res.data.length;
        for (let i = 0; i < schoolListSize; i++) {
          this.schoolNameList[i] = new Schoolm();
          this.schoolNameList[i].name = res.data[i].school[0].name;
          this.schoolNameList[i].schoolId = res.data[i].school[0].schoolId;
        }

        for (let i = 0; i < schoolListSize; i++) {
          const media = this.schoolsSearch[i].school[0].schoolMedia.length;
          this.schoolLogo = new SchoolLogo();
          for (let k = 0; k < media; k++) {

            if (this.schoolsSearch[i].school[0].schoolMedia) {
              if (this.schoolsSearch[i].school[0].schoolMedia[k].mediaTypeId == 1) {

                this.schoolLogo.schoolId = this.schoolsSearch[i].school[0].schoolId;
                this.schoolLogo.mediaLocation = this.schoolsSearch[i].school[0].schoolMedia[k].mediaLocation;
                this.schoolLogoList.push(this.schoolLogo);

              }
            }
          }
          if (media == 0) {
            this.schoolLogo.schoolId = this.schoolsSearch[i].school[0].schoolId;
            this.schoolLogo.mediaLocation = './assets/img/image_placeholder.jpg';
            this.schoolLogoList.push(this.schoolLogo);
          }
        }
      },
      (err) => {
        console.log(err);
      })
  }

  getLogo(id): string {
    var mediaString = this.schoolLogoList.find(({ schoolId }) => schoolId === id);
    var media: string = mediaString.mediaLocation == null ? './assets/img/image_placeholder.jpg' : mediaString.mediaLocation;
    return media;
  }

}




