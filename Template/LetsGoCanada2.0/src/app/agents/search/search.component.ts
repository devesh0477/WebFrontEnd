import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { School } from 'src/app/models/school';
import { GeneralService } from 'src/app/services/general.service';
import { SchoolMedia } from 'src/app/models/schoolMedia';
import { NgModel } from '@angular/forms';
import { Router, NavigationEnd } from '@angular/router';

declare const $: any;
@Component({
	selector: 'app-search',
	templateUrl: './search.component.html',
	styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
	schools: Array<School>;
	pageOfItems: Array<School>;
	pageSize: number;
	isActive: boolean = false;
	typeSchool: string[];
	provinces: string[];
	cities: string[];
	schoolNames: string[];
	searchString: string = "";
	selectedTypeSchools: string[];
	selectedProvinces: number[];
	selectedCities: number[];
	selectedSchoolNames: string[];
	backgroundImage: string;
	logoImage: string[] = [];
	id: string;
	public logos: SchoolMedia;
	data: any;
	private sizeScreen: any;
	public hasSchool;

	constructor(
		private schoolsService: GeneralService,
		private router: Router,
	) {
		if (localStorage.getItem('session') === null || JSON.parse(localStorage.getItem('session')).id == 0) {
			this.router.navigate(['/login']);
		}
	}

	/**
	 * @author Deivid Mafra;
	 * @date 08/28/2019;
	 * @remarks This method receives the value coming from the getSearchString() method in searchSchool Component;
	 * @param text The string that will be used as a key for search engine.
	 */
	setSearchString(text: string) {
		this.searchString = text;
		this.getSchools();
	}

	ngOnInit() {
		this.getSchools();
		this.getSchoolFilterOptions();
		this.getCities();
		this.getSizeScreen();
	}

	/**
	 * @author Deivid Mafra;
	 * @date 09/13/2019;
	 * @remarks This method controls the items to do the pagination;
	 * @param pageOfItems A list of school to be displayed.
	 */
	onChangePage(pageOfItems: Array<School>) 
	{
		this.pageOfItems = pageOfItems;
	}

	/**
	 * @author Deivid Mafra;
	 * @date 08/31/2019;
	 * @remarks This method clean up the selection controls from the search engine;
	 * @param typeSchools Select control with a list of types of school (university, college, language...);
	 * @param provinces Select control with a list of provinces;
	 * @param cities Select control with a list of cities;
	 * @param schoolNames Select control with a list of school names.
	 */
	deselectAll(typeSchools: NgModel, provinces: NgModel, cities: NgModel, schoolNames: NgModel) {
		typeSchools.update.emit([]);
		provinces.update.emit([]);
		cities.update.emit([]);
		schoolNames.update.emit([]);
	}

	showNotification(from: any, align: any, type: any, messages: any): void {
		$.notify({
			icon: 'notifications',
			message: messages
		}, {
			type: type,
			timer: 3000,
			placement: {
				from: from,
				align: align
			},
			template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
				'<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
				'<i class="material-icons" data-notify="icon">notifications</i> ' +
				'<span data-notify="title">{1}</span> ' +
				'<span data-notify="message">{2}</span>' +
				'<div class="progress" data-notify="progressbar">' +
				'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
				'</div>' +
				'<a href="{3}" target="{4}" data-notify="url"></a>' +
				'</div>'
		});
	}

	/**
	 * @author Deivid Mafra;
	 * @date 08/28/2019;
	 * @remarks This method get a list of schools from the end-point getSchoolList.
	 */
	getSchools() {
		let url: string = '/School/getSchoolList';
		let data = {
			"searchString": this.searchString,
			"TypeSchool": this.selectedTypeSchools,
			"province": this.selectedProvinces,
			"city": this.selectedCities,
			"schoolNames": this.selectedSchoolNames,
		}

		this.schoolsService.post(url, data).subscribe(
			(res) => {
				if (!res.data[0]) {
					this.showNotification('top', 'right', 'danger', 'There is no schools for this selection!');
					this.schools = [];
				} else {
					this.schools = res.data;
					this.schools[0].logos = new SchoolMedia();
					for (let i = 0; i < this.schools.length; i++) {
						this.schools[i].logos = new SchoolMedia();
						this.schools[i].logos.mediaLocation = "./assets/img/image_placeholder.jpg";
						for (let k = 0; k < this.schools[i].schoolMedia.length; k++) {
							if (this.schools[i].schoolMedia[k].mediaTypeId == 1) {
								this.schools[i].logos.mediaLocation = this.schools[i].schoolMedia[k].mediaLocation;
							}
						}
					}
				}
			},
			(err) => {
				console.log(err);
			})
	}

	showSearchMenu() {
		this.isActive = true;
	}
	hideSearchMenu() {
		this.isActive = false;
	}

	/**
	 * @author Deivid Mafra;
	 * @date 08/28/2019;
	 * @remarks This method populate the selection controls of the search engine.
	 */
	getSchoolFilterOptions() {
		let url: string = '/School/getSchoolFilterOptions/';

		this.schoolsService.getService(url).subscribe(
			(res) => {
				// console.log("getSchoolFilterOptions", res)
				this.typeSchool = res.data.typeSchool;
				this.provinces = res.data.provinces;
				// console.log("this.provinces", this.provinces);
				this.schoolNames = res.data.schoolNames;
			},
			(err) => {
				console.log(err);
			})
	}

	getCities() {
		let url = "/School/getGeoList";
		this.schoolsService.getService(url).subscribe(
			(res) => {
				this.cities = res.data.city;
				// console.log("this.cities", this.cities);
			},
			(err) => {
				console.log(err);
			}
		)
	}

	/**
	 * @author Deivid Mafra;
	 * @date 11/11/2019;
	 * @remarks This method sets the number of items that will be displayed by the paginator according to the screen size.
	 */
	getSizeScreen() {
		this.sizeScreen = window.innerWidth;
		// console.log("check size>>>", this.sizeScreen)

		if (this.sizeScreen < 1536) {
			this.pageSize = 6;
		} else if (this.sizeScreen > 1536 && this.sizeScreen <= 2048) {
			this.pageSize = 10;
		} else if (this.sizeScreen > 2048 && this.sizeScreen <= 2559) {
			this.pageSize = 12;
		} else if (this.sizeScreen > 2559) {
			this.pageSize = 14;
		} else
			this.pageSize = 8;

		// console.log("Qty Items", this.pageSize)
	}
}


