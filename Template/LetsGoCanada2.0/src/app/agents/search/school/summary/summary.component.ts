import { Component, OnInit } from '@angular/core';
import { School } from 'src/app/models/school';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';


@Component({
	selector: 'app-summary',
	templateUrl: './summary.component.html',
	styleUrls: ['./summary.component.css']
})
export class SummaryComponent implements OnInit {


	schools: School;
	schoolLogo: string;

	constructor(private schoolsService: GeneralService, private route: ActivatedRoute, private newRouter: Router) { }

	ngOnInit() {
		this.getSchoolInfoById();
	}

	/**
	* @author Deivid Mafra;
	* @date 10/03/2019;
	* @remarks This method gets a specific school by id.
	*/
	getSchoolInfoById() {

		let url: string = '/School/getSchool/';
		this.schoolsService.getService(url + this.getSchoolId()).subscribe(
			(res) => {

				if (res.data.length < 1) {
					this.newRouter.navigate(['/search'])
				} else
					this.schools = res.data;
				// console.log("this.schools:>>>>", this.schools)

				if (this.schools[0].schoolMedia) {
					const media = this.schools[0].schoolMedia.length;
					// console.log("media= ", media);
					for (let i = 0; i < media; i++) {
						if (this.schools[0].schoolMedia[i].mediaTypeId == 1) {
							var logo: string = this.schools[0].schoolMedia[i].mediaLocation;
						}
						if (logo) {
							this.schoolLogo = logo;
						} else {
							this.schoolLogo = './assets/img/image_placeholder.jpg';
						}

					}
				}
			},
			(err) => {
				console.log(err);
			});
	}

	/**
	* @author Deivid Mafra;
	* @date 10/03/2019;
	* @remarks This method gets the school id.
	*/
	getSchoolId() {
		return this.route.snapshot.paramMap.get('id');
	}
}