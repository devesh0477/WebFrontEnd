import { Program } from './../../../../models/program';
import { GeneralService } from './../../../../services/general.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { showNotification } from 'src/app/toast-message/toast-message';
import { ComunicationService } from 'src/app/services/comunication.service';

@Component({
  selector: 'app-campus-program',
  templateUrl: './campus-program.component.html',
  styleUrls: ['./campus-program.component.css']
})
export class CampusProgramComponent implements OnInit {

  public programList: Array<Program>;
  tableHeader: string[] = ['Program Name', 'Special Name', 'Type of Program', 'Action'];
  public pageOfItems: Array<Program>;
  public campusName: string;

  constructor(private campusService: GeneralService, private route: ActivatedRoute, private comunication: ComunicationService) {

    this.comunication.listenerProcess().subscribe(
      (res) => {
        if (res.message == 'Ok')
          this.getCampusProgramList()
      }
    )

  }

  ngOnInit() {
    this.getCampusNameById();
    this.getCampusProgramList();
  }

  /**
   * @author Deivid Mafra;
   * @date 06/08/2020;
   * @remarks This method is responsible for loading the campus list from the back-end
   */
  getCampusProgramList() {
    let url: string = '/school/getCampusProgramList/' + this.getCampusId();
    this.campusService.getService(url).subscribe(
      (res) => {
        this.programList = res.data.sort();
        // console.log("this.programList>>>>", this.programList)
      },
      (err) => {
        console.log(err);
      });
  }

  getCampusId = () => {
    return this.route.snapshot.paramMap.get('id');
  }

  onChangePage(pageOfItems: Array<Program>) {
    this.pageOfItems = pageOfItems;
  }

  deleteProgram = (id: number) => {
    let url: string = '/school/deleteCampusProgram/' + id;
    this.campusService.delete(url).subscribe(
      (res) => {
        // console.log('res', res)
        this.programList = this.programList.filter(program => program.id !== id)
        // console.log(this.programList)
        showNotification('top', 'right', 'success', `Program deleted successfully `);
      },
      (err) => {
        console.log(err);
        showNotification('top', 'right', 'danger', err.error.message);
      });
  }

  getCampusNameById = () => {
    let url: string = '/school/getCampusByID/' + this.getCampusId();
    // console.log('url', url);

    this.campusService.getService(url).subscribe(
      res => {
        this.campusName = res.data[0].campusName;
        // console.log('this.campusName', this.campusName);
      },
      err => {
        console.log('err', err);
      }
    )
  }

}
