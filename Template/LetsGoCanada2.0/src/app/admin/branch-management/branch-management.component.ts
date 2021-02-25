import { Component, OnInit } from '@angular/core';
import { SearchString } from 'src/app/models/searchString';
import { GeneralService } from 'src/app/services/general.service';
import { Branch } from 'src/app/models/branch';

@Component({
  selector: 'app-branch-management',
  templateUrl: './branch-management.component.html',
  styleUrls: ['./branch-management.component.css']
})
export class BranchManagementComponent implements OnInit {

  tableHeader: string[];
  selectedBranchID: string[] = [];
  selectedAgencyId: string[] = [];
  pageOfItems: Array<Branch>;
  branches: Array<Branch>;
  branch: Branch;

  constructor(private agentService: GeneralService) { }

  ngOnInit() {
    this.tableHeader = ['Agency', 'Headquater', 'Branch Name', 'City', 'Province', 'Country', 'Edit'];
    this.getListBranches();
  }

  onChangePage(pageOfItems: Array<Branch>) {
    this.pageOfItems = pageOfItems;
  }

  /**
   * @author Deivid Mafra;
   * @date 11/04/2019;
   * @remarks This method gets the info from app-branch-search component to set the search engine.
   */
  setFilters(searchString: SearchString) {
    this.selectedBranchID = searchString.branch;
    this.selectedAgencyId = searchString.agency;
    this.getListBranches();
  }

  /**
 * @author Deivid Mafra;
 * @date 11/04/2019;
 * @remarks This method gets the info necessary for a branch;
 */
  getListBranches() {
    let url: string = '/agent/getListBranches';
    let data = {
      "BranchID": this.selectedBranchID,
      "AgencyId": this.selectedAgencyId
    }

    this.agentService.post(url, data).subscribe(
      (res) => {
        this.branches = res.data;
        // console.log("branchesList>>>", this.branches)
      },
      (err) => {
        console.log(err);
      })
  }

  /**
   * @author Deivid Mafra;
   * @date 11/04/2019;
   * @remarks This method gets the info necessary for a branch;
   * @param branch It`s the branch info that comes from selected branch for the end-user;
   */
  getAgent(branch: Branch) {
    this.branch = branch;
    // console.log("branch>>>", this.branch)
  }

  /**
   * @author Deivid Mafra;
   * @date 11/04/2019;
   * @remarks This method is responsible for dynamically positioning the page according to the end-user action.
   * @param el It`s representing the html element target.
   */
  scrollUpTo(el: HTMLElement) {
    el.scrollIntoView();
  }
}
