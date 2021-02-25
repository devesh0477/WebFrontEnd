import { Component, OnInit } from '@angular/core';
import { Status } from 'src/app/models/status';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-status',
  templateUrl: './status.component.html',
  styleUrls: ['./status.component.css']
})
export class StatusComponent implements OnInit {

  tableHeader: string[] = ['Status', 'Description', 'Edit'];

  public selectedStatus: Status;
  public statusList: Array<Status>;
  public pageOfItems: Array<Status>;
  public srcDescription: string;
  public srcName: string;
  public table;

  constructor(private statusService: GeneralService) { }

  ngOnInit() {
    this.getStatusListFiltered();
  }

  /**
   * @author Deivid Mafra;
   * @date 04/24/2020;
   * @param status - is a complete status object;
   * @remarks This method is responsible for allowing the end-user select a status to edit by clicking on that in the table.
   */
  selectStatus(status: Status) {
    this.selectedStatus = status;
    console.log(">>>", this.selectedStatus);
  }

  /**
   * @author Deivid Mafra;
   * @date 04/24/2020;
   * @remarks This method is responsible for loading the status list from the back-end
   */
  getStatusListFiltered() {
    let url: string = '/admin/getStatusListFiltered';

    let data = {
      "Name": this.srcName,
      "Description": this.srcDescription
    }

    this.statusService.post(url, data).subscribe(
      (res) => {
        this.statusList = res.data.sort();
        console.log('this.statusList', this.statusList)
      },
      (err) => {
        console.log(err);
      });
  }

  getFilteredStatus(searchArray) {

    console.log(searchArray);

    this.srcDescription = searchArray.description;
    this.srcName = searchArray.name;

    this.getStatusListFiltered();
  }

  onChangePage(pageOfItems: Array<Status>) {
    this.pageOfItems = pageOfItems;
  }

}
