import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { Agent } from 'src/app/models/agent';
import { SearchString } from 'src/app/models/searchString';

@Component({
  selector: 'app-agent-management',
  templateUrl: './agent-management.component.html',
  styleUrls: ['./agent-management.component.css']
})
export class AgentManagementComponent implements OnInit {
  tableHeader: string[];
  searchString: string = "";
  selectedAgentID: string[] = [];
  selectedBranchID: string[] = [];
  selectedAgencyId: string[] = [];
  pageOfItems: Array<Agent>;
  agents: Array<Agent>;
  agent: Agent;

  constructor(private agentService: GeneralService) { }

  ngOnInit() {
    this.tableHeader = ['User Name', 'Name', 'Last Name', 'Role', 'Agency', 'Branch', 'Edit'];
    this.getUserLoginFiltered();
  }

  onChangePage(pageOfItems: Array<Agent>) {
    this.pageOfItems = pageOfItems;
  }

  /**
   * @author Deivid Mafra;
   * @date 10/22/2019;
   * @remarks This method is responsible for feed the getUserLoginFiltered function with the passed keys.
   * @param searchString
   */
  setFilters(searchString: SearchString) {
    this.searchString = searchString.text;
    this.selectedAgentID = searchString.agent;
    this.selectedBranchID = searchString.branch;
    this.selectedAgencyId = searchString.agency;
    this.getUserLoginFiltered();
  }

  /**
   * @author Deivid Mafra;
   * @date 10/21/2019;
   * @remarks This method is responsible for the search engine and returns the agents looked for
   */
  getUserLoginFiltered() {
    let url: string = '/user/getUserLoginFiltered';
    let data = {
      "searchString": this.searchString,
      "AgentID": this.selectedAgentID,
      "BranchID": this.selectedBranchID,
      "AgencyId": this.selectedAgencyId
    }

    this.agentService.post(url, data).subscribe(
      (res) => {
        this.agents = res.data;
        // console.log("AgentsList>>>", this.agents)
      },
      (err) => {
        console.log(err);
      })
  }

  getAgent(agent: Agent) {
    this.agent = agent;
    // console.log("Agent>>>", this.agent)
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
