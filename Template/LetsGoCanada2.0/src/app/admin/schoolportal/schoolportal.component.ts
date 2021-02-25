import { School } from './../../models/school';
import { Component, OnInit, ElementRef } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { TableData } from 'src/app/md/md-table/md-table.component';
import { MatSelectChange, ErrorStateMatcher } from '@angular/material';
import { City } from 'src/app/models/city';
import { FormControl, FormGroupDirective, NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Schoolm } from 'src/app/models/schoolm';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';
import { Feature } from 'src/app/models/feature';
import { FinantialsSchool } from 'src/app/models/finantialsSchool';
import { ConstantPool } from '@angular/compiler';
import { SchoolMedia } from 'src/app/models/schoolMedia';
import { forEach } from '@angular/router/src/utils/collection';
import { ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { showNotification } from 'src/app/toast-message/toast-message';
import { isNullOrUndefined } from 'util';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { VideoObj } from 'src/app/models/videoObj';



declare const $: any;

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

//@ViewChild('myInput') myInputVariable: ElementRef;

@Component({
	selector: 'app-schoolportal',
	templateUrl: './schoolportal.component.html',
	styleUrls: ['./schoolportal.component.css']
})
export class SchoolportalComponent implements OnInit {

	@ViewChild('myInput') myInputVariable: ElementRef;
	@ViewChild('closeVideoModal') closeVideoModal: ElementRef;
	@ViewChild('sForm') sForm;
	@ViewChild('videoUrlForm') formValues;
	public finInfo: FinantialsSchool;
	public tableData1: TableData;
	public schoolList: Array<Schoolm>;
	public countries;
	public provinces;
	public cities: Array<City>;
	public tempCities: Array<City>;
	public school: Schoolm;
	public typeInstitutions;
	public buttonName: string = 'Save';
	public schoolMedia: Array<SchoolMedia>;
	public pageOfItems: Array<Schoolm>;
	private schoolId: string;
	private schoolIdForVideo: number;
	public schoolNameForVideo: string;
	public videoLinkSanitized: SafeResourceUrl;
	public videoUrl: Array<VideoObj> = [];
	public feature = {
		'hasAccomodation': false,
		'hasWorkWhileStudy': false,
		'hasConditionalLoa': false,
		'hasPgwp': false,
		'hasCoop': false,
		'schoolId': 0
	}

	public schoolMediaTypeList = new Array(
		{ 'typeId': 'lgo', 'description': 'Logo' },
		{ 'typeId': 'bck', 'description': 'Background' },
		{ 'typeId': 'spi', 'description': 'Support Image' }
	);

	public isWorking: boolean = false;
	public whosWorking: string = '';

	schoolForm: FormGroup;
	// schooltype: FormGroup;
	// mediaType: FormGroup;

	public opcionSeleccionado;

	constructor(private service: GeneralService,
		private sanitizer: DomSanitizer,
		private formBuilder: FormBuilder,
		private router: Router,) {
		this.schoolForm = this.createSchoolTypeGroup();
		if (localStorage.getItem('session') === null || JSON.parse(localStorage.getItem('session')).id == 0) {
			this.router.navigate(['/login']);
		} else {
			this.loadSchools();
			this.loadCountries();
			this.loadTypeInstitutions();
		}

	}

	/**
	 * @param paramet 
	 * @author Diego.Perez
	 * @date 12/07/2020
	 */
	onPopUpDoing(paramet: string) {

		if (!isNullOrUndefined(paramet) && paramet === this.whosWorking) {
			console.log('==================================>> ', paramet);
			return true;
		} else {
			console.log('::::::::::::::::::::::::::::::::::: ', paramet);
			return false;
		}
	}

	/**
	 * @author Deivid Mafra, Diego.Perez
	 * @date 01/30/2020, 02/20/2020
	 */
	onSubmitFin(formFina) {
		if (!formFina.valid) {
			showNotification('top', 'right', 'danger', 'Please fill out the form correctly!')
		} else {
			let url: string = '/school/setSchoolFinantials';
			this.whosWorking = 'finantial';
			this.service.post(url, this.finInfo).subscribe(
				(res) => {
					if (res.message == 'Ok') {
						console.log(res.data[0])
						this.finInfo = res.data[0];
						showNotification('top', 'right', 'success', 'Finantial info saved successfully!');
						this.reset();
					}
					this.whosWorking = '';
				},
				(err) => {
					console.log(err)
					showNotification('top', 'right', 'danger', 'Error trying to save the Finantial info!');
					this.whosWorking = '';
				}
			)
		}
	}

	/**
	 * @param schoolId 
	 * @author Deivid Mafra, Diego.Perez
	 * @date 01/30/2020, 02/20/2020
	 */
	showSchoolFinancial(finaSchool) {

		this.finInfo = finaSchool.finantialsSchool;
		// console.log('this.finInfo', this.finInfo)
	}

	/**
	 * 
	 * @param pageOfItems 
	 * @author Diego.Perez
	 * @date 09/14/2019
	 */
	onChangePage(pageOfItems: Array<Schoolm>) {
		this.pageOfItems = pageOfItems
	}

	isFieldValid(form: FormGroup, field: string) {
		return !form.get(field).valid && form.get(field).touched;
	}

	displayFieldCss(form: FormGroup, field: string) {
		return {
			'has-error': this.isFieldValid(form, field),
			'has-feedback': this.isFieldValid(form, field)
		};
	}

	reset() {
		// console.log(this.myInputVariable.nativeElement.files[0]);
		this.myInputVariable.nativeElement.value = "";
		$('#schoolMediaId').val(null);
		// console.log(this.myInputVariable.nativeElement.files);
	}

	ngOnInit() {

		this.finInfo = new FinantialsSchool();

		this.tableData1 = {
			headerRow: ['Name', 'Description', 'City', 'Email', 'Actions'],
			dataRows: [
				['Dakota Rice', 'Niger', 'Oud-Turnhout', '$36,738'],
				['Minerva Hooper', 'Curaçao', 'Sinaai-Waas', '$23,789'],
				['Sage Rodriguez', 'Netherlands', 'Baileux', '$56,142'],
				['Philip Chaney', 'Korea, South', 'Overland Park', '$38,735'],
				['Doris Greene', 'Malawi', 'Feldkirchen in Kärnten', '$63,542'],
				['Mason Porter', 'Chile', 'Gloucester', '$78,615']
			]
		};

		var mainPanel = document.getElementsByClassName('main-panel')[0];
		$('.modal').on('shown.bs.modal', function () {
			mainPanel.classList.add('no-scroll');
		})
		$('.modal').on('hidden.bs.modal', function () {
			mainPanel.classList.remove('no-scroll');
		})


		this.school = new Schoolm();

		// this.schooltype = this.formBuilder.group({
		// 	// To add a validator, we must first convert the string value into an array. 
		// 	//The first item in the array is the default value if any, then the next item in the array is the validator. 
		// 	//Here we are adding a required validator meaning that the firstName attribute must have a value in it.
		// 	schoolName: this.school.name,
		// 	description: [null, Validators.required],
		// 	email: [null, Validators.required],
		// 	phoneNumber: [null, Validators.required],
		// 	address: [null, Validators.required],
		// 	postalCode: [null, Validators.required],
		// 	country: [null, Validators.required],
		// 	province: [null, Validators.required],
		// 	city: [null, Validators.required],
		// 	pobox: [null, Validators.required],
		// 	dliNumber: [null, Validators.required],
		// 	hstNumber: [null, Validators.required],
		// 	website: [null, Validators.required],
		// 	about: [null, Validators.required],
		// 	publicInsti: [null, Validators.required],
		// 	internaStudents: [null, Validators.required],
		// 	totalStudents: [null, Validators.required],
		// 	fundationDate: [null, Validators.required],
		// 	typeInstitution: [null, Validators.required],
		// 	KeyWords: [null, Validators.required]
		// });

	}

	createSchoolTypeGroup() {
		return new FormGroup({
			schoolName: new FormControl('', [Validators.required]),
			description: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required]),
			phoneNumber: new FormControl('', [Validators.required]),
			address: new FormControl('', [Validators.required]),
			postalCode: new FormControl('', [Validators.required]),
			country: new FormControl('', [Validators.required]),
			province: new FormControl('', [Validators.required]),
			city: new FormControl('', [Validators.required]),
			pobox: new FormControl('', [Validators.required]),
			dliNumber: new FormControl('', [Validators.required]),
			hstNumber: new FormControl('', [Validators.required]),
			website: new FormControl('', [Validators.required]),
			about: new FormControl('', [Validators.required]),
			publicInsti: new FormControl(''),
			internaStudents: new FormControl('', [Validators.required]),
			totalStudents: new FormControl('', [Validators.required]),
			fundationDate: new FormControl('', [Validators.required]),
			typeInstitution: new FormControl('', [Validators.required]),
			KeyWords: new FormControl('', [Validators.required]),
		});
	}

	// get schoolName() {
	// 	return this.schoolForm.get('schoolName');
	// }
	// get description() {
	// 	return this.schoolForm.get('description');
	// }

	/**
	 * 
	 * @author Diego.Perez.
	 * @date 08/16/2019.
	 */
	loadTypeInstitutions() {

		let url: string = '/School/getTypeSchoolList';

		this.service.getService(url).subscribe(
			(res) => {
				//console.log(res);
				this.typeInstitutions = res.data;
			},
			(err) => {
				console.log(err);
			}
		);
	}

	/**
	 * 
	 * @param event 
	 * @author Diego.Perez.
	 * @date 08/13/2019
	 */
	selectProvinceChange(event: MatSelectChange) {

		//console.log(this.tempCities);// [<any>event]);
		this.poputaleCitiesByProvinceId(<any>event);

	}

	/**
	 * 
	 * @param cityId 
	 * @author Diego.Perez.
	 * @date 08/16/2019.
	 */
	poputaleCitiesByProvinceId(provinceId) {
		this.cities = new Array<City>();
		this.tempCities.forEach(city => {
			if (city.provinceId == provinceId) {
				this.cities.push(city);
			}
		});
	}

	/**
	 * @author Diego.Perez.
	 * @date 08/13/2019
	 */
	loadCountries() {
		let url: string = '/School/getGeoList';

		this.service.getService(url).subscribe(
			(res) => {
				// console.log(res)
				this.countries = res.data.country;
				this.provinces = res.data.province;
				//console.log(res.data.city);
				this.tempCities = new Array<City>();
				this.tempCities = res.data.city;
			},
			(err) => {
				console.log(err)
			}
		);
	}

	/**
	 * 
	 * @author Diego.Perez.
	 * @date 08/13/2019
	 */
	loadSchools() {
		let data = {
			'searchString': "",
			'TypeSchool': [],
			'province': [],
			'schoolNames': []
		};

		let url: string = '/School/getSchoolList/';

		this.service.post(url, data).subscribe(
			(res) => {
				//console.log(res.data);
				this.schoolList = new Array<Schoolm>();
				this.schoolList = res.data;
				//console.log(this.schoolList);
				//this.loadSchoolMediaBySchoolId();
			},
			(err) => {
				console.log(err);
			}
		);
	}

	/**
	 * 
	 * @author Diego.Perez.
	 * @date 08/21/2019.
	 */
	loadSchoolMediaBySchoolId() {
		let url: string;

		//this.schoolList.forEach(scho => {
		url = '/school/getSchoolMedia/1';// + scho.schoolId;
		//console.log(url);

		this.service.getService(url).subscribe(
			res => {
				console.log(res.data)
			},
			err => {
				console.log(err)
			}
		);
		//});
	}

	/**
	 * 
	 * @param schoolId 
	 * @author Diego.Perez.
	 * @date 08/13/2019.
	 */
	editSchool(school) {

		this.school = new Schoolm();
		this.school = school;
		this.populateSchoolToEdit();
	}

	/**
	 * @param school 
	 * @author Deivid Mafra
	 * @date 12/02/2020.
	 */
	setVideo = ({ value }: { value: any }) => {

		let videoObject = {
			"MediaRowID": 0,
			"ResourceID": this.schoolIdForVideo,
			"ResourceURL": value.videoUrl
		}

		let url: string = '/media/setSchoolVideoURL';
		this.whosWorking = 'newvideo';
		this.service.post(url, videoObject).subscribe(
			res => {
				if (res.message == 'Ok') {
					this.formValues.resetForm();
					this.videoLinkSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(res.data[0].mediaLocation);
					let videoObj = new VideoObj();
					videoObj.mediaId = res.data[0].schoolMediaId;
					videoObj.mediaUrl = this.videoLinkSanitized;
					this.videoUrl.push(videoObj);
					showNotification('top', 'right', 'success', 'Video url saved successfully');
					this.loadSchools();

				} else {
					showNotification('top', 'right', 'danger', res.message);
				}
				this.whosWorking = '';
			},
			(err) => {
				console.log(err)
				showNotification('top', 'right', 'danger', 'An error trying to save the video');
				this.whosWorking = '';
			}
		);
	}

	/**
	 * @param school 
	 * @author Deivid Mafra
	 * @date 12/02/2020.
	 */
	showVideo = (school) => {

		this.videoUrl = [];
		this.schoolIdForVideo = school.schoolId;
		this.schoolNameForVideo = school.name;

		if (school.schoolMedia.length > 0) {

			for (let i = 0; i < school.schoolMedia.length; i++) {
				let videoObj = new VideoObj();

				if (school.schoolMedia[i].mediaTypeId == 4) {
					this.videoLinkSanitized = this.sanitizer.bypassSecurityTrustResourceUrl(school.schoolMedia[i].mediaLocation);
					videoObj.mediaId = school.schoolMedia[i].schoolMediaId;
					videoObj.mediaUrl = this.videoLinkSanitized;
					this.videoUrl.push(videoObj);
				}
			}
		}
	}

	/**
	 * @param school 
	 * @author Deivid Mafra
	 * @date 12/02/2020.
	 */
	deleteVideo = (mediaId: number, index: number) => {

		let videoObject = {
			"MediaRowID": mediaId,
		}

		let url: string = '/media/deleteSchoolVideoURL';
		this.whosWorking = 'delvideo' + index;
		this.service.delete(url, videoObject).subscribe(
			res => {
				if (res.message == 'Ok') {
					showNotification('top', 'right', 'success', 'Video deleted successfully');
					this.videoUrl = this.videoUrl.filter(video => res.data[0].schoolMediaId != video.mediaId);
					this.loadSchools();

				} else {
					showNotification('top', 'right', 'danger', res.message);
				}
				this.whosWorking = '';
			},
			(err) => {
				console.log(err)
				showNotification('top', 'right', 'danger', 'Error trying to delete the video');
				this.whosWorking = '';
			}
		);
	}

	/**
	 * 
	 * @author Diego.Perez.
	 * @date 08/15/2019.
	 */
	populateSchoolToEdit() {

		this.schoolForm.get('schoolName').setValue(this.school.name);

		this.schoolForm.get('description').setValue(this.school.description);
		this.schoolForm.get('email').setValue(this.school.email);
		this.schoolForm.get('phoneNumber').setValue(this.school.phoneNumber);
		this.schoolForm.get('address').setValue(this.school.headquaerterAddress);
		this.schoolForm.get('postalCode').setValue(this.school.postalCode);
		this.schoolForm.get('country').setValue(this.school.countryId);
		this.schoolForm.get('province').setValue(this.school.provinceId);
		this.poputaleCitiesByProvinceId(this.school.provinceId);
		this.schoolForm.get('city').setValue(this.school.cityId);
		this.schoolForm.get('pobox').setValue(this.school.pobox);
		this.schoolForm.get('dliNumber').setValue(this.school.dli);
		this.schoolForm.get('hstNumber').setValue(this.school.hstnumber);
		this.schoolForm.get('website').setValue(this.school.website);
		this.schoolForm.get('about').setValue(this.school.about);
		this.schoolForm.get('internaStudents').setValue(this.school.internationaStudents);
		this.schoolForm.get('totalStudents').setValue(this.school.totalStudents);
		this.schoolForm.get('fundationDate').setValue(this.school.fundationDate);
		this.schoolForm.get('typeInstitution').setValue(this.school.typeInstitutionId);
		this.schoolForm.get('KeyWords').setValue(this.school.keyWords);
		this.schoolForm.get('publicInsti').setValue(this.school.publicInstitution);

		this.buttonName = 'Update';
	}

	/**
	 * 
	 * @author Diego.Perez.
	 * @date 08/16/2019
	 */
	sendSchoolBack() {

		let url: string = '/School/setSchool';
		this.fillSchool();
		this.isWorking = true;
		this.service.post(url, this.school).subscribe(
			(res) => {
				if (res.message == 'Ok') {

					if (this.buttonName === 'Save') {
						this.school = res.data[0];
						this.schoolList.unshift(this.school);
						showNotification('top', 'right', 'success', 'The school was saved correctly.');
					}
					else {
						showNotification('top', 'right', 'success', 'The school was updated correctly.');
					}
					this.loadSchools();//Added to update the school list automatically
					this.school = new Schoolm();
					this.clearForm();
					this.buttonName = 'Save';

				}
				this.isWorking = false;
			},
			(err) => {
				showNotification('top', 'right', 'danger', 'An error ocurred trying to save the school. Please check the required fields in red!');
				this.isWorking = false;
				console.log(err)
			}
		);
	}

	/**
	 * 
	 * @author Diego.Perez.
	 * @date 08/16/2019.
	 */
	fillSchool() {

		this.school.name = this.schoolForm.get('schoolName').value;
		this.school.description = this.schoolForm.get('description').value;
		this.school.email = this.schoolForm.get('email').value;
		this.school.phoneNumber = this.schoolForm.get('phoneNumber').value;
		this.school.headquaerterAddress = this.schoolForm.get('address').value;
		this.school.postalCode = this.schoolForm.get('postalCode').value;

		this.school.countryId = this.schoolForm.get('country').value;
		this.school.provinceId = this.schoolForm.get('province').value;
		this.school.cityId = this.schoolForm.get('city').value;

		this.school.pobox = this.schoolForm.get('pobox').value;
		this.school.dli = this.schoolForm.get('dliNumber').value;
		this.school.hstnumber = this.schoolForm.get('hstNumber').value;
		this.school.website = this.schoolForm.get('website').value;
		this.school.about = this.schoolForm.get('about').value;
		this.school.internationaStudents = this.schoolForm.get('internaStudents').value;
		this.school.totalStudents = this.schoolForm.get('totalStudents').value;
		this.school.fundationDate = this.schoolForm.get('fundationDate').value;

		this.school.typeInstitutionId = this.schoolForm.get('typeInstitution').value;

		this.school.keyWords = this.schoolForm.get('KeyWords').value;
		this.school.publicInstitution = this.schoolForm.get('publicInsti').value;

		if (this.school.feature == null) {
			this.school.feature = new Feature();
		}

		if (this.school.finantialsSchool == null) {
			this.school.finantialsSchool = new FinantialsSchool();
		}

	}

	/**
	 * 
	 * @author Diego.Perez.
	 * @date 08/16/2019.
	 */
	clearForm() {
		this.sForm.resetForm();
		this.school = new Schoolm();
		// this.schoolForm.get('schoolName').setValue('');
		// this.schoolForm.get('description').setValue('');
		// this.schoolForm.get('email').setValue('');
		// this.schoolForm.get('phoneNumber').setValue('');
		// this.schoolForm.get('address').setValue('');
		// this.schoolForm.get('postalCode').setValue('');

		// this.schoolForm.get('country').setValue(-1);
		// this.schoolForm.get('province').setValue(-1);
		// this.schoolForm.get('city').setValue(-1);

		// this.schoolForm.get('pobox').setValue('');
		// this.schoolForm.get('dliNumber').setValue('');
		// this.schoolForm.get('hstNumber').setValue('');
		// this.schoolForm.get('website').setValue('');
		// this.schoolForm.get('about').setValue('');
		// this.schoolForm.get('internaStudents').setValue('');
		// this.schoolForm.get('totalStudents').setValue('');
		// this.schoolForm.get('fundationDate').setValue('');

		// this.schoolForm.get('typeInstitution').setValue(-1);

		// this.schoolForm.get('KeyWords').setValue('');
		// this.schoolForm.get('publicInsti').setValue('');
		// this.buttonName = 'Save';
	}

	/**
	 * 
	 * @param row 
	 * @author Diego.Perez.
	 * @date 11/11/2019
	 */
	showSchoolFeatures(object) {
		this.feature = object.feature
	}


	/**
	 * @author Deivid Mafra.
	 * @date 11/29/2019.
	 * @param school - Selected school which the media list will come from
	 * @remarks This method gets a list of media from a specific school chosen by the user. 
	 * If there are no media, placeholder images are shown for Logo, Background, and Support image.
	 */
	showSchoolsMedia(school) {
		this.schoolMedia = school.schoolMedia;
		this.schoolId = school.schoolId;

		let logoFlag: boolean = false;
		let backFlag: boolean = false;

		if (this.schoolMedia.length > 0) {
			for (let i = 0; i < this.schoolMedia.length; i++) {

				if (this.schoolMedia[i].mediaTypeId == 1) {
					logoFlag = true;
				}

				if (this.schoolMedia[i].mediaTypeId == 2) {
					backFlag = true;
				}
			}

			if (!logoFlag) {

				let logo: SchoolMedia = new SchoolMedia();
				logo.mediaTypeId = 1;
				logo.schoolId = this.school.schoolId;
				logo.mediaLocation = './assets/img/image_placeholder.jpg';
				this.schoolMedia.push(logo);
			}

			if (!backFlag) {

				let backImg: SchoolMedia = new SchoolMedia();
				backImg.mediaTypeId = 2;
				backImg.schoolId = this.school.schoolId;
				backImg.mediaLocation = './assets/img/image_placeholder.jpg';
				this.schoolMedia.push(backImg);
			}
		} else {
			let logo: SchoolMedia = new SchoolMedia();
			logo.mediaTypeId = 1;
			logo.schoolId = this.school.schoolId;
			logo.mediaLocation = './assets/img/image_placeholder.jpg';
			this.schoolMedia.push(logo);

			let backImg: SchoolMedia = new SchoolMedia();
			backImg.mediaTypeId = 2;
			backImg.schoolId = this.school.schoolId;
			backImg.mediaLocation = './assets/img/image_placeholder.jpg';
			this.schoolMedia.push(backImg);
		}
	}

	/**
	 * 
	 * @author Diego.Perez
	 * @date 08/27/2019
	 */
	deleteOneMedia(formData: FormData, schoolId: any, mediaTypeId: any, index: number) {

		let id: number = this.schoolMedia[index].schoolMediaId;

		this.service.getService('/school/DeleteSchoolMedia/' + id).subscribe(
			(res) => {
				console.log(res)
				if (res.data.message == 'Ok') {

					console.log('Se ha eliminado correctamente.')
					this.setNewSchoolMedia(formData, mediaTypeId, index);
				}
			},
			(err) => {
				console.log(err)
			}
		);
	}

	/**
	 * 
	 * @author Diego.Perez.
	 * @date 08/20/2019.
	 */
	onDocumentChange(event, schoolId, mediaTypeId, index) {

		const file = event.target.files[0];
		const formData = new FormData();
		formData.append('file', file);

		if (this.schoolMedia[index].schoolMediaId != null) {
			if (this.schoolMedia[index].mediaTypeId != 1) {
				console.log('mediaTypeId = 2 or other')
				this.deleteOneMedia(formData, schoolId, mediaTypeId, index);

				//Adding new media after deleted the former.
				this.setNewSchoolMedia(formData, mediaTypeId, index);
				showNotification('top', 'right', 'success', 'The media was saved successfully.');

			} else {
				console.log('mediaTypeId = 1')
				//console.log(this.schoolMedia[index].schoolMediaId)
				// this.deleteDocument(this.schoolMedia[index].schoolMediaId, index);
				this.setNewSchoolMedia(formData, mediaTypeId, index);
				showNotification('top', 'right', 'success', 'The media was saved successfully.');
			}
		} else {
			console.log('schoolMediaId = null')
			this.setNewSchoolMedia(formData, mediaTypeId, index);
			showNotification('top', 'right', 'success', 'The media was saved successfully.');
		}
	}

	/**
	 * 
	 * @param formData 
	 * @param schoolId 
	 * @param mediaTypeId 
	 * @param index 
	 * @author Diego.Perez
	 * @date 08/27/2019
	 */
	setNewSchoolMedia(formData: FormData, mediaTypeId: any, index: number) {

		let url: string = '/School/setSchoolMedia?SchoolID=' + this.schoolId + '&MediaTypeID=' + mediaTypeId;
		this.whosWorking = 'media' + index;
		this.service.postFile(url, formData).subscribe(
			(res) => {

				if (res.data.message == 'Ok') {
					//this.schoolMedia[index].forEach(media => {
					if (this.schoolMedia[index].mediaTypeId == mediaTypeId) {

						this.schoolMedia[index].mediaLocation = res.data.data[0].mediaLocation;
						this.schoolMedia[index].mediaName = res.data.data[0].mediaName;
						this.schoolMedia[index].schoolMediaId = res.data.data[0].schoolMediaId;
					}
					this.whosWorking = '';
				} else {
					showNotification('top', 'right', 'danger', 'An error occurred trying to save the media.');
					this.whosWorking = '';
				}
			},
			(err) => {
				console.log(err)
				showNotification('top', 'right', 'danger', 'An error occurred trying to save the media.');
				this.whosWorking = '';
			}
		)
	}

	/**
	 * 
	 * @param event 
	 * @author Diego.Perez.
	 * @date 08/21/2019.
	 */
	onNewDocumentChange(event) {
		console.log('we are going to treat the school below')
		console.log(event.target.files[0]);

		let url: string = '/School/setSchoolMedia?SchoolID=' + this.schoolId + '&MediaTypeID=3';
		let file = event.target.files[0];
		let formData = new FormData();

		formData.append('file', file);
		this.whosWorking = 'newmedia';
		this.service.postFile(url, formData).subscribe(
			(res) => {
				console.log(res)
				if (res.data.message == 'Ok') {
					let media: SchoolMedia = new SchoolMedia();
					media = res.data.data[0];
					this.schoolMedia.push(media);
					this.reset();
				} else
					//showing the error messages from the end-point
					showNotification('top', 'right', 'danger', res.data.message + '. ' + res.data.data.Message);

				this.whosWorking = '';
			},
			(err) => {
				console.log(err)
				showNotification('top', 'right', 'danger', 'An error occurred trying to save the media.');
				this.whosWorking = 'newmedia';
			}
		)
	}

	/**
	 * 
	 * @param event 
	 * @param schoolId
	 * @author Diego.Perez.
	 * @date 08/22/2019. 
	 */
	deleteDocument(schoolMediaId, index) {
		console.log('tolis a eliminar ' + schoolMediaId + ' -  ' + index)

		//create the logic to delete images from the azure
		let url: string = '/school/DeleteSchoolMedia/' + schoolMediaId;

		this.service.getService(url).subscribe(
			(res) => {
				console.log(res)
				if (res.message == 'Ok') {
					if (this.schoolMedia[index].mediaTypeId > 2) {
						this.schoolMedia.splice(index, 1);
					} else {
						this.schoolMedia[index].schoolMediaId = null;
						this.schoolMedia[index].mediaName = '';
						this.schoolMedia[index].mediaLocation = './assets/img/image_placeholder.jpg';
						this.schoolMedia[index].mediaType = null;
					}
					showNotification('top', 'right', 'success', 'The media was deleted successfully.');
				}
			},
			(err) => {
				console.log(err)
				showNotification('top', 'right', 'danger', 'An error occurred trying to delete the media.');
			}
		)
	}


	/**
	 * @author Diego.Perez
	 * @date 10/26/2019
	 */
	schoolProgramsPage() {
		//this.router. = {name: ''};

		console.log('///////////////////////////////////////////////////////////')
		// this.router.navigate(['school-programs/' + this.school.schoolId  + '/' + ], { queryParams: { schoolId: this.school.schoolId, schoolName: this.school.name } });
		this.router.navigate(['school-programs/' + this.school.schoolId + '/' + this.school.name]);
	}

	/**
	 * @author Deivid Mafra.
	 * @date 11/29/2019
	 * @param schoolId - Id of the school which will have its programs edited
	 */
	schoolPrograms(obj: Schoolm) {

		this.router.navigate(['school-programs/' + obj.schoolId + '/' + obj.name]);
	}

	/**
	 * @author Diego.Perez
	 * @date 11/12/2019
	 */
	saveFeatures() {

		let url: string = '/school/setSchoolFeatures';

		let data = {
			'schoolId': this.feature.schoolId,
			'hasCoop': this.feature.hasCoop,
			'hasWorkWhileStudy': this.feature.hasWorkWhileStudy,
			'hasPgwp': this.feature.hasPgwp,
			'hasAccomodation': this.feature.hasAccomodation,
			'hasConditionalLoa': this.feature.hasConditionalLoa
		}

		this.whosWorking = 'features';

		this.service.post(url, data).subscribe(
			(res) => {
				if (res.message == 'Ok') {
					$('#featureModal').modal('toggle');
					showNotification('top', 'right', 'success', 'The school feature was saved successfully.');
				}
				this.whosWorking = '';
			},
			(err) => {
				console.log(err)
				showNotification('top', 'right', 'danger', 'An error occurred trying to save the school feature.');
				this.whosWorking = '';
			}
		)
	}

}
