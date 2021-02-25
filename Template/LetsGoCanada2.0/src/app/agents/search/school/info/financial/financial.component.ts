import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { ActivatedRoute, Router } from '@angular/router';
import { School } from 'src/app/models/school';

declare interface TableData {
  headerRow: string[];
  dataRows: string[][];
}

declare interface TableWithCheckboxes {

  product_name: string;
  amount: string;
}

export interface TableData2 {
  headerRow: string[];
  dataRows: TableWithCheckboxes[];
}

@Component({
  selector: 'app-financial',
  templateUrl: './financial.component.html',
  styleUrls: ['./financial.component.css']
})
export class FinancialComponent implements OnInit {
  public tableData2: TableData2;

  applicationFees: number;
  costOfLiving: number;
  tuitionPerYear: number;
  totalPerYear: number;
  id: string;
  obsText: string = " These academic year fees are estimates and are subject to change. Tuition fees will increase in each subsequent year. Fees do not include books (unless specifically noted), supplies or living costs."

  constructor(private schoolsService: GeneralService, private route: ActivatedRoute, private newRouter: Router) { }

  ngOnInit() {
    this.getSchoolById();
  }

  /**
   * @author Deivid Mafra;
   * @date 08/29/2019;
   * @remarks this method returns the finantial information about the specific school by the id that comes from URL.
   */
  getSchoolById() {
    let url: string = '/School/getSchool/';
    this.schoolsService.getService(url + this.getSchoolId()).subscribe(
      (res) => {
        if (res.data.length < 1) {
          this.newRouter.navigate(['/search'])
        } else {
          this.applicationFees = res.data[0].finantialsSchool.applicationFees;
          this.costOfLiving = res.data[0].finantialsSchool.costOfLiving;
          this.tuitionPerYear = res.data[0].finantialsSchool.tuitionPerYear;
          this.totalPerYear = res.data[0].finantialsSchool.totalPerYear;
        }
      },
      (err) => {
        console.log(err);
      });
  }

  getSchoolId() {
    return this.id = this.route.snapshot.paramMap.get('id');
  }

}
