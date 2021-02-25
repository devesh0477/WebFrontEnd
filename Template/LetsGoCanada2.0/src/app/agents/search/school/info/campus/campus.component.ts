import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { ActivatedRoute } from '@angular/router';
import { Campus } from 'src/app/models/campus';

@Component({
  selector: 'app-campus',
  templateUrl: './campus.component.html',
  styleUrls: ['./campus.component.css']
})
export class CampusComponent implements OnInit {

  public campuses: Campus[];

  constructor(private campusService: GeneralService, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getCampusListingPerSchool();
  }

  getCampusListingPerSchool = () => {
    let url: string = '/school/getCampusListingPerSchool/' + this.getSchoolId();

    this.campusService.getService(url).subscribe(
      res => {
        // console.log('res.data', res.data);
        this.campuses = res.data;
      },
      err => {
        console.log(err);
      }
    )
  }

  getSchoolId() {
    return this.route.snapshot.paramMap.get('id');
  }

}
