import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { showNotification } from 'src/app/toast-message/toast-message';
import { Application } from 'src/app/models/applicantion';

@Component({
  selector: 'app-generic-program-list',
  templateUrl: './generic-program-list.component.html',
  styleUrls: ['./generic-program-list.component.css']
})
export class GenericProgramListComponent implements OnInit {


  @ViewChild('searchModal') searchInput: ElementRef;
  @Input() programList;

  private programId: number;
  private programPerTermId: number;
  public terms: string[];
  public applicantResult: string[];
  private newApplication: Application;
  public applicantId: number;
  public applicantString: string = " ";


  constructor(private programsService: GeneralService) { }

  ngOnInit() {
    // console.log('this.programList from generic:', this.programList)
  }

  getProgramId(id: number) {
    this.programId = id;
    this.getTermsById();
  }


  /**
    * @author Deivid Mafra;
    * @date 09/17/2019;
    * @remarks this method returns the terms by chosen id.
    */
  getTermsById() {
    let url: string = '/School/getProgramDetails/' + this.programId;
    this.programsService.getService(url).subscribe(
      (res) => {
        this.terms = res.data[0].programsPerTerm;
      },
      (err) => {
        console.log(err);
      })
  }

}
