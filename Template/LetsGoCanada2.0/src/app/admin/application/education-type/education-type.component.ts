import { EduType } from './../../../models/eduType';
import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-education-type',
  templateUrl: './education-type.component.html',
  styleUrls: ['./education-type.component.css']
})
export class EducationTypeComponent implements OnInit {

  tableHeader: string[] = ['Education Type', 'Level', 'Edit'];

  public selectedEduType: EduType;
  public eduTypeList: Array<EduType>;
  public pageOfItems: Array<EduType>;
  public srclevelName: string;
  public srcName: string;
  public table;

  constructor(private edutypeService: GeneralService) { }

  ngOnInit() {
    this.getEducationTypeList();
  }

  /**
   * @author Deivid Mafra;
   * @date 04/23/2020;
   * @param eduType - is a complete education type object;
   * @remarks This method is responsible for allowing the end-user select a education type to edit by clicking on that in the table.
   */
  selectEduType(eduType: EduType) {
    this.selectedEduType = eduType;
    console.log(">>>", this.selectedEduType);
  }

  /**
   * @author Deivid Mafra;
   * @date 04/23/2020;
   * @remarks This method is responsible for loading the eduType list from the back-end
   */
  getEducationTypeList() {
    // let url: string = '/applicant/getEducationTypeList';
    let url: string = '/admin/getEduTypeListFiltered';

    let data = {
      "LevelName": this.srclevelName,
      "EduTypeName": this.srcName
    }

    // console.log('data', data)

    this.edutypeService.post(url, data).subscribe(
      (res) => {
        this.eduTypeList = res.data.sort();
      },
      (err) => {
        console.log('ERROR->>> ', err);
      });
  }

  getFilteredEduType(searchArray) {

    console.log(searchArray);

    this.srclevelName = searchArray.levelName;
    this.srcName = searchArray.eduTypeName;

    this.getEducationTypeList();
  }

  onChangePage(pageOfItems: Array<EduType>) {
    this.pageOfItems = pageOfItems;
  }

}
