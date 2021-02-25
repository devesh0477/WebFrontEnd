import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { ActivatedRoute } from '@angular/router';
import { Campus } from 'src/app/models/campus';
import { VideoObj } from 'src/app/models/videoObj';

@Component({
  selector: 'app-campus-details',
  templateUrl: './campus-details.component.html',
  styleUrls: ['./campus-details.component.css']
})
export class CampusDetailsComponent implements OnInit {
  private campusId: string;
  public campusData: Campus;
  public programList: any[];
  public videoObj: VideoObj = new VideoObj();

  constructor(private campusService: GeneralService, private route: ActivatedRoute) {
    this.getCampusByID();
  }

  ngOnInit() {
    this.getCampusProgramList();

  }

  getCampusId = () => {
    this.videoObj.mediaId = +this.route.snapshot.paramMap.get('id');
    this.videoObj.url = '/media/getCampusVideoURL/';
    this.videoObj.width = 920;
    this.videoObj.height = 600;
    return this.route.snapshot.paramMap.get('id');
  }

  getCampusByID = () => {
    let url: string = '/school/getCampusByID/' + this.getCampusId();

    this.campusService.getService(url).subscribe(
      res => {
        this.campusData = res.data[0];
      },
      err => {
        console.log('err', err);
      }
    )
  }

  getCampusProgramList = () => {
    let url: string = '/school/getCampusProgramList/' + this.getCampusId();
    this.campusService.getService(url).subscribe(
      res => {
        this.programList = res.data;
      },
      err => {
        console.log('err', err);
      }
    )

  }

}
