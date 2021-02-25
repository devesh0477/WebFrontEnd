import { Component, OnInit, ViewChild, ElementRef, Input, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { Application } from 'src/app/models/applicantion';
import { Program } from 'src/app/models/program';
import { Applicant } from 'src/app/models/applicant';
import swal from 'sweetalert2';
import { showNotification } from '../../../../toast-message/toast-message';
import { Campus } from 'src/app/models/campus';
import { VideoObj } from 'src/app/models/videoObj';

declare const $: any;

@Component({
  selector: 'app-program-detail',
  // template: `<br><br><br><br><br><br><h1> Testing new API</h1>`,
  templateUrl: './program-detail.component.html',
  styleUrls: ['./program-detail.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ProgramDetailComponent implements OnInit {
  imgPlaceholder: string = "./assets/img/image_placeholder.jpg";
  applicantId: number;
  applicant: Applicant;
  programId: string;
  schoolId: string;
  program: Program;
  programPerTerm: string[];
  media: string[];
  background: string;
  terms: string[];
  newApplication: Application;
  programPerTermId: number;
  @ViewChild('searchModal') searchInput: ElementRef;
  applicantString: string = " ";
  applicantResult: Array<Applicant>;
  public typeOfProgramTip: string = "Type Of Program toolTip Cooperative education(or co- operative education) is a method of combining classroom - based education with practical work experience.A cooperative education experience(co - op), provides academic credit for structured job experience.Co - ops are full - time, paid or unpaid positions.";

  public applicationCosts: any;
  public discipline: any;
  public programAdmissionDetails: any;
  public programDetails: any;
  public programsPerTerm: any;
  public programName: string;
  public schoolName: string;
  public typeOfProgram: string;
  public termList: any[];
  public campuses: Campus[];
  public videoObj: VideoObj = new VideoObj();

  constructor(private route: ActivatedRoute, private programService: GeneralService, private newRouter: Router) {
    this.getTermList();
  }

  ngOnInit() {
    this.applicant = JSON.parse(localStorage.getItem('session')).selfApplicant;
    this.getProgramDetails();
    // this.getProgram();
    this.getProgramPerTermListPerProgram();
    this.getBackImgProgram();
    this.getProgramPerCampus();
  }

  clear() {
    this.searchInput.nativeElement.value = "";
  }

  searchApplicant() {
    this.applicantString = this.searchInput.nativeElement.value;
    // console.log("From programs-list.component: " + this.applicantString)

    let url: string = '/Applicant/getApplicantListfiltered';

    let data = {

      "searchString": this.applicantString,
      "city": [],
      "Province": [],
      "countryID": [],
      "AgentID": [],
      "BranchID": [],
      "AgencyID": [],
      "ProfileComplete": ["true"],
    }

    this.programService.post(url, data).subscribe(
      (res) => {
        if (!res.data[0]) {
          this.clear();
          showNotification('top', 'right', 'danger', 'No applicants with search terms!');

        } else {
          this.applicantResult = res.data;
          // console.log("this.applicantResult:", this.applicantResult)
        }
      },
      (err) => {
        console.log(err);
      })

  }

  getApplicant(): Applicant {
    if (localStorage.getItem('session') === null || JSON.parse(localStorage.getItem('session')).role == '6') {
      return JSON.parse(localStorage.getItem('session')).selfApplicant;
    } else {
      return this.applicant;
    }
  }


  setNewApplication() {
    // this.getProgramId();
    this.getApplication();

    if (this.applicant != null && this.applicant.profileComplete == false) {
      showNotification('top', 'right', 'danger', 'User profile is not complete!');
      return;
    }


    let url: string = '/Application/setNewApplication/';
    this.programService.post(url, this.newApplication).subscribe(
      (res) => {
        if (res.message == 'Ok') {
          showNotification('top', 'right', 'success', 'Application created successfully!');
        }
      },
      (err) => {

        //this.showNotification('top', 'right', 'danger', 'Error trying to create the application!')
        showNotification('top', 'right', 'danger', err.error.data);
      }
    )
  }

  getApplication() {
    this.newApplication = new Application();

    if (this.getApplicant() != null) {
      this.newApplication.ApplicantID = this.getApplicant().applicantId;
    } else {
      this.newApplication.ApplicantID = this.applicantId;
    }
    this.newApplication.ProgramsPerTermID = this.programPerTermId;
    this.newApplication.AccomodationId = 1; // I need to know where I'll get this information
    this.newApplication.InternalStatusId = 3; // I need to know where I'll get this information
  }

  getProgramPerTermId(ppTermId: number) {
    this.programPerTermId = ppTermId;
  }

  getProgramId() {
    this.videoObj.mediaId = +this.route.snapshot.paramMap.get('id');
    this.videoObj.url = '/media/getProgramVideoURL/';
    this.videoObj.width = 700;
    this.videoObj.height = 480;
    return this.programId = this.route.snapshot.paramMap.get('id');
  }

  getBackImgProgram() {
    let url: string = '/school/getProgramMedia/';
    this.programService.getService(url + this.getProgramId()).subscribe(
      (res) => {
        if (!res.data[0]) {
          this.background = this.imgPlaceholder
        } else
          this.background = res.data[0].mediaLocation;
        // console.log("this.background", this.background);
        (err) => {
          console.log(err);
        }
      });
  }

  getProgramDetails = () => {
    let url: string = '/School/getProgramDetails/';
    this.programService.getService(url + this.getProgramId()).subscribe(
      res => {
        // console.log('res', res)
        this.applicationCosts = res.data[0].applicationCosts;
        // console.log('this.applicationCosts', this.applicationCosts)
        this.discipline = res.data[0].discipline;
        // console.log('this.discipline', this.discipline);
        this.programAdmissionDetails = res.data[0].programAdmissionDetails;
        // console.log('this.programAdmissionDetails', this.programAdmissionDetails);
        this.programDetails = res.data[0].programDetails;
        // console.log('this.programDetails', this.programDetails);
        this.programsPerTerm = res.data[0].programsPerTerm;
        // console.log('this.programsPerTerm', this.programsPerTerm);

        this.schoolId = res.data[0].schoolId;
        // console.log("this.schoolId>>", this.schoolId)
        this.programName = res.data[0].name;
        this.schoolName = res.data[0].school.name; // check why it's coming as null
        this.typeOfProgram = res.data[0].typeOfProgram.name; // check why it's coming as null

        this.getSchoolMedia();
        // this.getTermById(4);
      },
      err => {
        console.log(err);
      });
  }

  getTermById = termId => {
    let term: any = this.termList.filter(termList => termList.termId == termId);
    // console.log('term', term[0].season)
    return term[0].season;
  }

  getTermList = () => {
    let url: string = '/admin/getTermList';

    this.programService.getService(url).subscribe(
      res => {
        this.termList = res.data;
        // console.log('this.termList', this.termList)
        // return res.data.season;
      },
      err => {
        console.log('err', err)
      }
    )
  }

  getSchoolMedia = () => {
    let url = '/school/getSchoolMedia/' + this.schoolId;
    this.programService.getService(url).subscribe(
      (res) => {
        this.media = res.data.logo.mediaLocation;
        // console.log("this.media", this.media)
      },
      (err) => {
        console.log(err);
      });
  }


  // getProgram() {
  //   let url: string = '/School/GetProgram/';
  //   this.programService.getService(url + this.getProgramId()).subscribe(
  //     (res) => {
  //       if (res.data.length < 1) {
  //         this.newRouter.navigate(['/search'])
  //       } else {
  //         this.program = res.data;
  //         console.log("this.program>>>", this.program)




  //         // url = '/school/getSchoolMedia/' + this.schoolId;
  //         // this.programService.getService(url).subscribe(
  //         //   (res) => {
  //         //     this.media = res.data.logo.mediaLocation;
  //         //     // console.log("this.media", this.media)
  //         //   },
  //         //   (err) => {
  //         //     console.log(err);
  //         //   });
  //       }
  //     },
  //     (err) => {
  //       console.log(err);
  //     })
  // }


  getProgramPerTermListPerProgram() {
    let url: string = '/School/getProgramPerTermListPerProgram/';
    this.programService.getService(url + this.getProgramId()).subscribe(
      (res) => {
        this.programPerTerm = res.data;
        // console.log("this.programPerTerm>>>", this.programPerTerm)
      },
      (err) => {
        console.log(err);
      })
  }

  /**
 * @author Deivid Mafra;
 * @date 12/25/2019;
 * @remarks This method shows modal up with details info;
 * @param type It's the type of info.
 */
  showSwal(type) {
    if (type == 'typeOfProgram') {
      swal({
        title: "Type of Program",
        text: this.typeOfProgramTip,
        buttonsStyling: false,
        confirmButtonClass: "btn btn"
      }).catch(swal.noop)
    } else if (type == 'Type1') {
      swal({
        title: "No Work while studying",
        text: "the vaiable that contains the data from the back-end",
        buttonsStyling: false,
        confirmButtonClass: "btn btn"
      }).catch(swal.noop)
    } else if (type == 'Type1') {
      swal({
        title: "No Conditional offer letter",
        text: "the vaiable that contains the data from the back-end",
        buttonsStyling: false,
        confirmButtonClass: "btn btn"
      }).catch(swal.noop)
    } else if (type == 'Type1') {
      swal({
        title: "No Accomodation",
        text: "the vaiable that contains the data from the back-end",
        buttonsStyling: false,
        confirmButtonClass: "btn btn"
      }).catch(swal.noop)
    } else if (type == 'Type1') {
      swal({
        title: "No Pgwp",
        text: "the vaiable that contains the data from the back-end",
        buttonsStyling: false,
        confirmButtonClass: "btn btn"
      }).catch(swal.noop)
    }
  }

  getProgramPerCampus = () => {
    let url: string = '/school/getProgramPerCampus/' + this.getProgramId();

    this.programService.getService(url).subscribe(
      res => {
        // console.log('res.data', res.data);
        this.campuses = res.data;
      },
      err => {
        console.log(err);
      }
    )
  }

} 
