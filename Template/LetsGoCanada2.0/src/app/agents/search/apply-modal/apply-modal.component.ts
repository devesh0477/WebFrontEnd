import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Applicant } from 'src/app/models/applicant';
import { GeneralService } from 'src/app/services/general.service';
import { showNotification } from 'src/app/toast-message/toast-message';
import { Application } from 'src/app/models/applicantion';


@Component({
  selector: 'app-apply-modal',
  templateUrl: './apply-modal.component.html',
  styleUrls: ['./apply-modal.component.css']
})
export class ApplyModalComponent implements OnInit {

  @ViewChild('searchModal') searchInput: ElementRef;
  @Input() terms: string[];
  applicant: Applicant;
  applicantString: string = " ";
  applicantResult: string[];
  newApplication: Application;
  programPerTermId: number;
  public termList: any[];
  applicantId: number;

  constructor(private programsService: GeneralService) {
    this.getTermList()
  }

  ngOnInit() {
    this.checkSelfApplicant();
  }

  /**
   * @author Deivid Mafra;
   * @date 09/25/2019;
   * @remarks this method allows the end-user looking for a specific applicant and returns applicants with complete profile.
   */
  searchApplicant = () => {
    this.applicantString = this.searchInput.nativeElement.value;

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

    this.programsService.post(url, data).subscribe(
      (res) => {
        if (!res.data[0]) {
          this.clear();
          showNotification('top', 'right', 'danger', 'No applicants with search terms!');

        } else {
          this.applicantResult = res.data;
        }
      },
      (err) => {
        console.log(err);
      })
  }

  clear() {
    this.searchInput.nativeElement.value = "";
  }

  selectedApplicant(applicantIdSelected: number) {
    this.newApplication.ApplicantID = applicantIdSelected;
  }

  /**
  * @author Deivid Mafra;
  * @date 09/17/2019;
  * @remarks this method gets the program per term id that will be used to create a new application;
  * @param ppTermId the valeu that comes from the selected option by the end-user.
  */
  getProgramPerTermId = (ppTermId: number) => {
    this.programPerTermId = ppTermId;
  }

  /**
  * @author Deivid Mafra;
  * @date 09/17/2019;
  * @param termId
  */
  getTermById = termId => {
    let term: any = this.termList.filter(termList => termList.termId == termId);
    return term[0].season;
  }

  /**
  * @author Deivid Mafra;
  * @date 09/17/2019;
  */
  getTermList = () => {
    let url: string = '/admin/getTermList';

    this.programsService.getService(url).subscribe(
      res => {
        this.termList = res.data;
      },
      err => {
        console.log('err', err)
      }
    )
  }

  /**
   * @author Deivid Mafra;
   * @date 09/17/2019;
   * @remarks this method is responsible to get all necessary information to create a new application
   */
  getApplication = () => {
    this.newApplication = new Application();
    this.newApplication.ApplicantID = this.applicantId === undefined ? this.applicant.applicantId : this.applicantId;
    this.newApplication.ProgramsPerTermID = this.programPerTermId;
    this.newApplication.AccomodationId = 1;
    this.newApplication.InternalStatusId = 2;
  }

  /**
   * @author Deivid Mafra;
   * @date 09/25/2019;
   * @remarks this method is responsible to create a new application;
   */
  setNewApplication = () => {
    this.getApplication();

    if (this.applicant != null && this.applicant.profileComplete == false) {
      showNotification('top', 'right', 'danger', 'User profile is not complete!');
      return;
    }

    let url: string = '/Application/setNewApplication/';
    this.programsService.post(url, this.newApplication).subscribe(
      (res) => {
        if (res.message == 'Ok') {
          showNotification('top', 'right', 'success', 'Application created successfully!');
        }
      },
      (err) => {
        showNotification('top', 'right', 'danger', err.error.data);
      }
    )
  }

  /**
  * @author Caio Uechi;
  */
  getApplicant(): Applicant {
    if (localStorage.getItem('session') === null || JSON.parse(localStorage.getItem('session')).role == '6') {
      return JSON.parse(localStorage.getItem('session')).selfApplicant;
    } else {
      return this.applicant;
    }
  }

  /**
  * @author Caio Uechi;
  */
  checkSelfApplicant = () => {
    var applicantSession = JSON.parse(localStorage.getItem('session')).selfApplicant;
    if (applicantSession != null) {
      this.applicant = applicantSession;
    }
  }
}
