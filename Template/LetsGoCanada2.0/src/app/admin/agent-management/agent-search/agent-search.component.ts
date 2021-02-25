import { Component, OnInit, ViewChild, Output, ElementRef, EventEmitter } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { NgModel } from '@angular/forms';
import { MatSelectChange } from '@angular/material';
import { SearchString } from 'src/app/models/searchString';

@Component({
  selector: 'app-agent-search',
  templateUrl: './agent-search.component.html',
  styleUrls: ['./agent-search.component.css']
})
export class AgentSearchComponent implements OnInit {

  @Output() newSearch: EventEmitter<SearchString> = new EventEmitter();

  @ViewChild('searchInput') searchInput: ElementRef;

  stringSearch: SearchString
  searchSelected: string = " ";
  agencySelected: string[] = [];
  branchSelected: string[] = [];
  agentSelected: string[] = [];
  agencies: string[];
  branches: string[];
  agents: string[];
  selectedAgency;
  selectedBranch;
  selectedAgent;


  constructor(private agentService: GeneralService) { }

  ngOnInit() {
    this.getAgencyPerRole();
    this.getBranchPerRole();
    this.getAgentPerRole();
  }

  /**
   * @author Deivid Mafra;
   * @date 10/22/2019;
   * @remarks This method is responsible for feed the agent-management component with the passed keys.
   */
  getSearch() {
    this.stringSearch = new SearchString();
    this.stringSearch.text = this.searchInput.nativeElement.value;
    this.stringSearch.agency = this.agencySelected;
    this.stringSearch.branch = this.branchSelected;
    this.stringSearch.agent = this.agentSelected;
    this.newSearch.emit(this.stringSearch);
    // console.log("this.stringSearch>>>", this.stringSearch)
  }

  onAgencyChange(event: MatSelectChange) {
    // console.log("event Agency>>", event)
    this.agencySelected = <any>event;
    this.getBranchPerRole();
  }

  onBranchChange(event: MatSelectChange) {
    // console.log("event Branch>>", event)
    this.branchSelected = <any>event;
    this.getAgentPerRole();
  }

  onAgentChange(event: MatSelectChange) {
    // console.log("event Agent>>", event)
    this.agentSelected = <any>event;
  }

  /**
   * @author Deivid Mafra;
   * @date 10/22/2019;
   * @remarks This method returns the agencies list. It's useful for the search engine dropdown list.
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
   * @date 10/22/2019;
   * @remarks This method returns the branches list from the agency selected previously. It's useful for the search engine dropdown list.
   */
  getBranchPerRole() {

    let url: string = '/agent/getBranchPerRole';
    let data = {
      "idSet": this.agencySelected,
    }
    this.agentService.post(url, data).subscribe(
      (res) => {
        this.branches = res.data;
        // console.log('this.branches', this.branches)
      },
      (err) => {
        console.log(err);
      })
  }

  /**
   * @author Deivid Mafra;
   * @date 10/22/2019;
   * @remarks This method returns the agents list from the branch selected previously. It's useful for the search engine dropdown list.
   */
  getAgentPerRole() {
    let url: string = '/agent/getAgentPerRole';

    // console.log('this.branchSelected', this.branchSelected)

    let data = {
      "idSet": this.branchSelected,
    }
    this.agentService.post(url, data).subscribe(
      (res) => {
        this.agents = res.data;
        // console.log('this.agents', this.agents)
      },
      (err) => {
        console.log(err);
      })
  }

  /**
   * @author Deivid Mafra;
   * @date 10/22/2019;
   * @remarks This method is responsible to clear all the dropdown lists up.
   * @param agency
   * @param branch
   * @param agent
   */
  deselectAll(agency: NgModel, branch: NgModel, agent: NgModel) {
    agency.update.emit([]);
    branch.update.emit([]);
    agent.update.emit([]);
    this.agencySelected = [];
    this.branchSelected = []
    this.agentSelected = [];
    this.searchInput.nativeElement.value = "";
    this.getAgentPerRole();
    this.getBranchPerRole();
  }
}
