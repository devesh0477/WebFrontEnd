import { Component, OnInit, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { SearchString } from 'src/app/models/searchString';
import { GeneralService } from 'src/app/services/general.service';
import { MatSelectChange } from '@angular/material';
import { NgModel } from '@angular/forms';

@Component({
  selector: 'app-branch-search',
  templateUrl: './branch-search.component.html',
  styleUrls: ['./branch-search.component.css']
})
export class BranchSearchComponent implements OnInit {

  @Output() newSearch: EventEmitter<SearchString> = new EventEmitter();

  stringSearch: SearchString
  agencySelected: string[] = [];
  branchSelected: string[] = [];
  agencies: string[];
  branches: string[];

  selectedAgency;
  selectedBranch;

  constructor(private agentService: GeneralService) { }

  ngOnInit() {
    this.getAgencyPerRole();
    this.getBranchPerRole();
  }

  /**
  * @author Deivid Mafra;
  * @date 11/04/2019;
  * @remarks This method sends all info from the search engine to branch-management component.
  */
  getSearch() {
    this.stringSearch = new SearchString();

    this.stringSearch.agency = this.agencySelected;
    this.stringSearch.branch = this.branchSelected;

    this.newSearch.emit(this.stringSearch);
    // console.log("this.stringSearch>>>", this.stringSearch)
  }

  /**
   * @author Deivid Mafra;
   * @date 11/04/2019;
   * @remarks This method returns the agency selected.
   * @param event 
   */
  onAgencyChange(event: MatSelectChange) {
    // console.log("event Agency>>", event)
    this.agencySelected = <any>event;
    this.getBranchPerRole();
  }

  /**
  * @author Deivid Mafra;
  * @date 11/04/2019;
  * @remarks This method returns the branch selected.
  * @param event
  */
  onBranchChange(event: MatSelectChange) {
    // console.log("event Branch>>", event)
    this.branchSelected = <any>event;
  }

  /**
    * @author Deivid Mafra;
    * @date 11/04/2019;
    * @remarks This method returns a list of agency to populate a the search engine options.
    */
  getAgencyPerRole() {

    let url: string = '/agent/getAgencyPerRole';
    this.agentService.getService(url).subscribe(
      (res) => {
        this.agencies = res.data;
        // console.log("this.agencies>>>", this.agencies)
      },
      (err) => {
        console.log(err);
      })
  }

  /**
    * @author Deivid Mafra;
    * @date 11/04/2019;
    * @remarks This method returns the branch by Id.
    */
  getBranchPerRole() {
    let url: string = '/agent/getBranchPerRole';
    let data = {
      "idSet": this.agencySelected,
    }
    this.agentService.post(url, data).subscribe(
      (res) => {
        this.branches = res.data;
      },
      (err) => {
        console.log(err);
      })
  }

  deselectAll(agency: NgModel, branch: NgModel) {
    agency.update.emit([]);
    branch.update.emit([]);
    this.agencySelected = [];
    this.branchSelected = []
    this.getBranchPerRole();
  }

}
