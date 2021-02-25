import { Component, OnInit, SimpleChanges, OnChanges, AfterViewInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { GeneralService } from 'src/app/services/general.service';
import { Education } from 'src/app/models/education';
import { showNotification } from 'src/app/toast-message/toast-message';
import { MatSelectChange } from '@angular/material';
import { Profile } from 'src/app/models/profile';
import { Language } from 'src/app/models/language';
import { Background } from 'src/app/models/background';
import { Documento } from 'src/app/models/documento';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';
import { ActivatedRoute, Router } from '@angular/router';
import swal from 'sweetalert2';

declare const $: any;

interface FileReaderEventTarget extends EventTarget {
	result: string;
}

interface FileReaderEvent extends Event {
	arget: EventTarget;
	getMessage(): string;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, OnChanges, AfterViewInit {

	countryCitizen = new FormControl('', [Validators.required]);

	emailFormControl = new FormControl('', [
		Validators.required,
		Validators.email,
	]);

	public result = { "message": '', "data": '' };
	public error: string;
	public countries; //= {'code': '', 'description': ''};
	public educationLevels;
	//public nativeLanguages;
	public testList;
	public acommodationLists;
	public yesNoList;
	public isMostRecentStudy: boolean = false;
	public isgraduatedStudy: boolean = false;
	public isComputerTest: boolean = false;
	public butname: string = "add";
	public btnToolTip: string = "Save";
	public isEducationDone: boolean = false;
	public isProfileDone: boolean = false;
	public currenTab: string = '';
	public countrySelected: string = '';
	public gradeSchemeList;
	public documents: Array<Documento>;
	public session;
	public marital;
	public notifi: NotificationsComponent;
	public profile: Profile = new Profile();
	public education: Education;
	public maxDate: Date;
	public minDate: Date;
	matcher = new MyErrorStateMatcher();
	public emailChecked: boolean = false;
	public emailTextChecked: string = '';
	public otherGender: boolean = false;

	validateControls: boolean = false;

	type: FormGroup;
	constructor(private service: GeneralService, private formBuilder: FormBuilder, private route: ActivatedRoute, private router: Router) {

		const currentYear = new Date();
		this.minDate = new Date(currentYear.getFullYear() - 60, 0, 1);
		this.maxDate = currentYear;

		this.session = JSON.parse(localStorage.getItem('session'));
		if (localStorage.getItem('session') === null || this.session.id == 0) {
			this.router.navigate(['/login']);
		} else {

			if (this.profile == null) {
				this.profile = new Profile();
			}

			this.profile.language = new Language();
			this.chargeApiList();
			this.loadApplicant();
		}

	}

	/**
	 * @author Diego.Perez
	 * @date 06/20/2020
	 */
	onOtherChange() {
		this.otherGender = true;
	}

	/**
	 * @author Diego.Perez
	 * @date 06/20/2020
	 */
	onMaFeChange() {
		this.otherGender = false;
	}

	/**
	 * Function to load the education information.
	 * 
	 * @author Diego.Perez.
	 * @date 07/10/2019.
	 */
	loadEducationApplicant() {
		// let url: string = '/Applicant/getEductionLevel/' + this.profile.applicantId;
		let id;
		if (this.route.snapshot.paramMap.get('id') == null) {
			id = this.profile.applicantId;
		} else {
			id = this.route.snapshot.paramMap.get('id');
		}

		let url: string = '/Applicant/getEductionLevel/' + id;
		this.service.getService(url).subscribe(
			(res) => {
				this.result = res;

				this.fillEducationVarsLoad(res.data);
			},
			(err) => this.error = err
		)
	}

	/**
	 * Function to load the language information applicant.
	 * 
	 * @author Diego.Perez.
	 * @date 07/20/2019.
	 */
	loadLanguageProficiency() {
		let url: string = '/Applicant/getLanguageProficiency/' + this.profile.applicantId;

		this.service.getService(url).subscribe(
			(res) => {
				this.result = res;

				this.fillLanguageVarsLoad(res.data);
			},
			(err) => this.error = err
		)
	}

	/**
	 * Function to fill al the field in the html for languages.
	 * 
	 * @param res Variable con datos de la respuesta.
	 * @author Diego.Perez.
	 * @date 07/20/2019.
	 */
	fillLanguageVarsLoad(res) {
		if (res.length > 0) {
			this.profile.language = res[0];

			this.type.get('typeTest').setValue(parseInt(this.profile.language.testName));
			this.type.get('computerBased').setValue(this.profile.language.computerBased);
			this.type.get('totalScore').setValue(this.profile.language.testScore);
			this.type.get('readScore').setValue(this.profile.language.readingScore);
			this.type.get('listeScore').setValue(this.profile.language.listeningScore);
			this.type.get('speakScore').setValue(this.profile.language.speakingScore);
			this.type.get('writeScore').setValue(this.profile.language.writingScore);
			this.type.get('dateTest').setValue(this.profile.language.testDate);
		}

		this.loadBackgroundInfo();

	}

	/**
	 * Funtion to charge all the information from the database related with background information applicant.
	 * 
	 * @author Diego.Perez.
	 * @date 07/22/2019.
	 */
	loadBackgroundInfo() {
		let url: string = '/Applicant/getBackgroundInfo/' + this.profile.applicantId;

		this.service.getService(url).subscribe(
			(res) => {

				this.result = res;
				if (res.data.length > 0) {
					this.fillBackgroundVarsLoad(res.data[0]);
				}
			},
			(err) => this.error = err
		)
	}

	/**
	 * Function to fill the field relate it with the background profile information
	 * 
	 * @param res The data with the information of the backgrounds profile
	 * @author Diego.Perez.
	 * @date 07/23/2019
	 */
	fillBackgroundVarsLoad(res) {

		let flag: boolean = false;

		if (this.profile.background == null) {
			this.profile.background = new Background();
		}

		this.profile.background.id = res['id'];
		this.profile.background.applicantId = res['applicantId'];

		if (res['appliedVisaCan']) {
			flag = true;
			this.type.get('appliedVisaCan').setValue(res['appliedVisaCan'].toString());
			this.profile.background.appliedVisaCan = res['appliedVisaCan'];
		} else {
			this.type.get('appliedVisaCan').setValue('false');
			this.profile.background.appliedVisaCan = false;
		}

		if (res['prevVisaRejection']) {
			flag = true;
			this.type.get('prev_Visa_Rejection').setValue(res['prevVisaRejection'].toString());
			this.profile.background.prevVisaRejection = res['prevVisaRejection'];
		} else {
			this.type.get('prev_Visa_Rejection').setValue('false');
			this.profile.background.prevVisaRejection = false;
		}

		if (res['visitedCanUsa']) {
			flag = true;
			this.type.get('visitedCanUSA').setValue(res['visitedCanUsa'].toString());
			this.profile.background.visitedCanUsa = res['visitedCanUsa'];
		} else {
			this.type.get('visitedCanUSA').setValue('false');
			this.profile.background.visitedCanUsa = false;
		}

		if (res['residingCanUsa']) {
			flag = true;
			this.type.get('residingCanUSA').setValue(res['residingCanUsa'].toString());
			this.profile.background.residingCanUsa = res['residingCanUsa'];
		} else {
			this.type.get('residingCanUSA').setValue('false');
			this.profile.background.residingCanUsa = false;
		}

		if (res['validCanStayPermit']) {
			flag = true;
			this.type.get('validCanStayPermit').setValue(res['validCanStayPermit'].toString());
			this.profile.background.validCanStayPermit = res['validCanStayPermit'];
		} else {
			this.type.get('validCanStayPermit').setValue('false');
			this.profile.background.validCanStayPermit = false;
		}

		if (res['validUsastayPermit']) {
			flag = true;
			this.type.get('validUSAStayPermit').setValue(res['validUsastayPermit'].toString());
			this.profile.background.validUsastayPermit = res['validUsastayPermit'];
		} else {
			this.type.get('validUSAStayPermit').setValue('false');
			this.profile.background.validUsastayPermit = false;
		}

		if (flag) {
			this.type.get('backComments').setValue(res['comments']);
			this.profile.background.comments = res['comments'];
		} else {
			this.type.get('backComments').setValue('N/A');
			this.profile.background.comments = 'N/A';
		}


		this.loadDocuments();

	}

	/**
	 * Method to call all the documents relate it.
	 * 
	 * @author Diego.Perez
	 */
	loadDocuments() {
		let url: string = '/Applicant/ListSupportDocuments/' + this.profile.applicantId;

		this.service.getService(url).subscribe(
			(res) => {
				this.result = res;
				this.loadDocumentsCards(res.data);
			},
			(err) => this.error = err
		)
	}

	/**
	 * Method to fill all the documents information to show it the final user.
	 * 
	 * @param data this is the information documents
	 * @author Diego.Perez.
	 * @date 07/23/2019.
	 */
	loadDocumentsCards(data) {
		this.profile.documentList = new Array<Documento>();
		data.forEach(element => {

			let docu: Documento = new Documento();

			docu.applicantId = element.applicantId;
			docu.id = element.id;
			docu.typeDoc = element.typeDoc;
			docu.documentLocation = element.documentLocation;
			docu.documentName = element.documentName;
			docu.uploaded = element.uploaded;
			docu.documentDescription = element.documentDescription.substr(element.documentDescription.indexOf(':') + 1, element.documentDescription.length);
			docu.doctype = element.documentDescription.substr(0, element.documentDescription.indexOf(':'));
			docu.indications = 'Could you please upload a clear document of ' + element.documentDescription.substr(element.documentDescription.indexOf(':') + 1, element.documentDescription.length);

			this.profile.documentList.push(docu);
		});

	}

	/**
	 * Function to fill the fields relate it with the education profile
	 * 
	 * @param data
	 * @author Diego.Perez.
	 * @date 07/10/2019.
	 */
	fillEducationVarsLoad(res) {

		let i: number = 0;
		this.profile.education_list = new Array<Education>();

		res.forEach(element => {

			let educa: Education = new Education();

			educa.idHtml = i;

			educa.applicantId = element.applicantId;

			educa.educationLevelId = element.educationLevelId;

			educa.educationLevel = element.educationLevel;

			educa.educationTypeId = element.educationTypeId;
			educa.educationType = element.educationType;

			educa.schoolName = element.schoolName;
			educa.degree = element.degree;

			educa.countryName = element.countryName;
			educa.countryId = element.countryId;

			educa.startDate = element.startDate;
			educa.endDate = element.endDate;

			educa.latestEducation = element.latestEducation;

			educa.primaryLanguage = element.primaryLanguage;

			educa.province = element.province;

			educa.city = element.city;

			educa.address = element.address;

			educa.postalCode = element.postalCode;

			educa.graduated = element.graduated;

			// if (!this.profile.education_list) {
			// 	this.profile.education_list = new Array<Education>();
			// }

			this.profile.education_list.push(educa);

			i = i + 1;

		});

		this.loadLanguageProficiency();

	}

	/**
	 * Function to load an actual applicant.
	 * 
	 * @author Diego.Perez
	 * @date 07/09/2019.
	 */
	loadApplicant() {

		let id = this.route.snapshot.paramMap.get('id');

		if (id != null) {
			let url: string = '/Applicant/getApplicant/' + id;
			this.service.getService(url).subscribe(
				(res) => {
					this.profile = res.data[0];
					this.result = res;

					this.fillProfileVarsLoad(res.data);
				},
				(err) => this.error = err
			)
		}
	}

	/**
	 * @author Diego.Perez
	 * @date 12/05/2019
	 */
	fillBackgroundNull() {

		this.type.get('appliedVisaCan').setValue('false');

		this.type.get('prev_Visa_Rejection').setValue('false');

		this.type.get('visitedCanUSA').setValue('false');

		this.type.get('residingCanUSA').setValue('false');

		this.type.get('validCanStayPermit').setValue('false');

		this.type.get('validUSAStayPermit').setValue('false');

		this.type.get('backComments').setValue('N/A');

	}

	/**
	 * Function to fill all the fields when the applicant exist.
	 */
	fillProfileVarsLoad(res) {

		this.profile.applicantId = res[0]['applicantId'];
		this.type.get('firstName').setValue(res[0]['firstName']);
		this.type.get('lastName').setValue(res[0]['lastName']);
		this.type.get('middleName').setValue(res[0]['middleName']);
		this.type.get('dob').setValue(res[0]['dateOfBirth']);
		this.type.get('countryCitizen').setValue(res[0]['citizenshipId']);
		this.type.get('province').setValue(res[0]['province']);
		this.type.get('passportNumber').setValue(res[0]['passportNumber']);

		this.type.get('addressProfile').setValue(res[0]['addressLine1']);
		this.type.get('countryProfile').setValue(res[0]['countryId']);

		this.type.get('phone').setValue(res[0]['phone']);
		this.type.get('zipcode').setValue(res[0]['postalCode']);
		this.type.get('email').setValue(res[0]['email']);
		this.type.get('city').setValue(res[0]['city']);
		this.type.get('maritaStatus').setValue(res[0]['maritaStatus']);


		if (res[0]['gender'] != 'male' && res[0]['gender'] != 'female') {
			this.otherGender = true;
			if (res[0]['gender'] != 'other') {
				this.type.get('otherName').setValue(res[0]['gender']);
				this.type.get('gender').setValue('other');
			}
		} else
			this.type.get('gender').setValue(res[0]['gender']);


		this.loadEducationApplicant();

	}

	/**
	 * Function to charge all the list in the component from the API.
	 * 
	 * @author Diego.Perez.
	 * @date 06/20/2019.
	 */
	chargeApiList() {

		let url: string = '/Applicant/getCountryNationality';

		this.service.getService(url).subscribe(
			(res) => {
				this.result = res;
				this.countries = res.data;
			},
			(err) => this.error = err
		);


		url = '/Applicant/getEducationTypeList';
		this.service.getService(url).subscribe(
			(res) => {
				this.result = res;
				this.educationLevels = res.data;
			},
			(err) => this.error = err
		);

		url = '/Applicant/getGradeSchemeList';
		this.service.getService(url).subscribe(
			(res) => {
				this.gradeSchemeList = res.data;
			},
			(err) => this.error = err
		)

		this.profile.education_list = new Array<Education>();

		url = '/school/getEnglishExamList';
		this.service.getService(url).subscribe(
			(res) => {
				this.testList = res;
			},
			(err) => {
				this.error = err
			}
		);

		url = '/Applicant/getMaritalStatus';
		this.service.getService(url).subscribe(
			(res) => {
				this.marital = res;
			},
			(err) => {
				this.error = err
			}
		);
	}

	/**
	 * Function to get the yes o no test take
	 * 
	 * @param event Parameter to get the event a new value fron select control.
	 * @author Diego.Perez
	 * @date 06/27/2019
	 */
	typeTestChangeHandler(event: MatSelectChange) {

		if (this.profile.language == null) {
			this.profile.language = new Language();
		}

		this.profile.language.testName = <any>event;
	}

	/**
	 * Function to know
	 * 
	 * @param event The parameter to know if the checkbox is checked.
	 * @author Diego.Perez.
	 * @date 07/20/2019.
	 */
	checkComputerTest(event) {
		this.isComputerTest = event.target.checked;
		if (this.profile.language == null) {
			this.profile.language = new Language();
		}

		this.profile.language.computerBased = event.target.checked;
	}

	/**
	 * Function to know if the study is the most recent one.
	 * 
	 * @param event The parameter to know if the checkbox is checked.
	 * @author Diego.Perez
	 * @date 06/23/2019.
	 */
	checkRecentSchool(event) {
		this.isMostRecentStudy = event.target.checked;
	}

	/**
	 * Funciton to know if the student already finish this study.
	 * 
	 * @param event The parameter to know if is checked.
	 * @author Diego.Perez.
	 * @date 07/11/2019.
	 */
	checkGraduatedSchool(event) {
		this.isgraduatedStudy = event.target.checked;
	}

	/**
	 * Function to get the information from the education list and edit it.
	 * 
	 * @param event parameter to control the click event
	 * @author Diego.Perez
	 * @date 06/23/2019 
	 */
	editStudyInfo(event) {
		event.preventDefault();

		if (this.butname == 'done') {

			this.education.schoolName = this.type.get('instituName').value;
			this.education.startDate = this.type.get('attendFrom').value;
			this.education.endDate = this.type.get('attendTo').value;
			this.education.degree = this.type.get('degree').value;

			this.education.educationTypeId = this.type.get('levEducation').value;
			this.education.countryId = this.type.get('counInstitu').value;
			this.education.gradeAverage = this.type.get('gradeAverage').value;
			this.education.latestEducation = this.type.get('isRecentSchool').value;
			this.education.latestEducation = this.isMostRecentStudy;

			this.education.graduated = this.type.get('isGraduated').value;
			this.education.graduated = this.isgraduatedStudy;

			this.education.primaryLanguage = this.type.get('primarylanguage').value;
			this.education.province = this.type.get('eduProvince').value;
			this.education.city = this.type.get('eduCity').value;
			this.education.address = this.type.get('eduAddress').value;
			this.education.postalCode = this.type.get('eduPostal').value;

			this.education.applicantId = this.profile.applicantId;

			this.profile.education_list.splice(this.education.idHtml, 0, this.education);
			this.cleanEducationForm();

			this.fillUpdateInformationEducation(event);
		} else {
			this.fillUpdateInformationEducation(event);
		}

	}

	/**
	 * 
	 * @param event Parameter from the html $event
	 * @author Diego.Perez
	 * @date 03/10/2020
	 */
	fillUpdateInformationEducation(event) {
		this.butname = "done";
		this.btnToolTip = "Update";
		this.education = new Education();
		let position: number = this.profile.education_list[event.currentTarget.id].idHtml;

		this.type.get('instituName').setValue(this.profile.education_list[event.currentTarget.id].schoolName);
		this.type.get('attendFrom').setValue(this.profile.education_list[event.currentTarget.id].startDate);
		this.type.get('attendTo').setValue(this.profile.education_list[event.currentTarget.id].endDate);
		this.type.get('degree').setValue(this.profile.education_list[event.currentTarget.id].degree);

		this.type.get('levEducation').setValue(this.profile.education_list[event.currentTarget.id].educationTypeId);
		this.type.get('counInstitu').setValue(this.profile.education_list[event.currentTarget.id].countryId);
		this.type.get('gradeAverage').setValue(this.profile.education_list[event.currentTarget.id].gradeAverage);
		this.type.get('isRecentSchool').setValue(this.profile.education_list[event.currentTarget.id].latestEducation);
		this.isMostRecentStudy = this.profile.education_list[event.currentTarget.id].latestEducation;

		this.type.get('isGraduated').setValue(this.profile.education_list[event.currentTarget.id].graduated);
		this.isgraduatedStudy = this.profile.education_list[event.currentTarget.id].graduated;

		this.type.get('primarylanguage').setValue(this.profile.education_list[event.currentTarget.id].primaryLanguage);
		this.type.get('eduProvince').setValue(this.profile.education_list[event.currentTarget.id].province);
		this.type.get('eduCity').setValue(this.profile.education_list[event.currentTarget.id].city);
		this.type.get('eduAddress').setValue(this.profile.education_list[event.currentTarget.id].address);

		this.type.get('eduPostal').setValue(this.profile.education_list[event.currentTarget.id].postalCode);

		this.education.idHtml = position;

		this.education.educationLevelId = this.profile.education_list[event.currentTarget.id].educationLevelId;
		this.education.applicantId = this.profile.education_list[event.currentTarget.id].applicantId;
		this.education.schoolName = this.profile.education_list[event.currentTarget.id].schoolName;
		this.education.educationLevel = this.profile.education_list[event.currentTarget.id].educationLevel;
		this.education.countryName = this.profile.education_list[event.currentTarget.id].countryName;

		this.profile.education_list.splice(position, 1);
	}

	/**
	 * Function to add levels of educations.
	 * 
	 * @author Diego.Perez
	 * @date 06/16/2019.
	 */
	addNewStudy() {
		this.profile.tab = $('.card-wizard .wizard-navigation li a.nav-link.active').html();
		if (this.profile.tab.trim() == "Education") {

			if (this.validateEducationFields()) {

				if (this.education.idHtml == null && this.profile.education_list == null) {

					this.profile.education_list = new Array<Education>();
					this.education.idHtml = this.profile.education_list.length;
				}

				this.education.schoolName = this.type.get('instituName').value;
				this.education.startDate = this.type.get('attendFrom').value;
				this.education.endDate = this.type.get('attendTo').value;
				this.education.degree = this.type.get('degree').value;

				//this.education.lev_education_code = this.type.get('levEducation').value;
				this.education.educationTypeId = this.type.get('levEducation').value;
				this.education.countryId = this.type.get('counInstitu').value;
				this.education.gradeAverage = this.type.get('gradeAverage').value;
				this.education.gradeScheme = this.type.get('gradeScheme').value;

				this.education.latestEducation = this.isMostRecentStudy;
				this.isMostRecentStudy = false;
				this.education.graduated = this.isgraduatedStudy;
				this.isgraduatedStudy = false;

				this.education.province = this.type.get('eduProvince').value;
				this.education.city = this.type.get('eduCity').value;
				this.education.primaryLanguage = this.type.get('primarylanguage').value;
				this.education.address = this.type.get('eduAddress').value;
				this.education.postalCode = this.type.get('eduPostal').value;

				this.education.applicantId = this.profile.applicantId;

				if (this.education.educationLevelId == null)
					this.education.educationLevelId = 0;

				this.saveEducation();

				this.butname = "add";
				this.btnToolTip = "Save";
			} else {
				showNotification('top', 'right', 'danger', 'Education not added! Please check the mandatory fields.');
				setTimeout(() => {
					$("mat-form-field.testy").addClass('mat-form-field-invalid');
					$('mat-select.testy').addClass('mat-select-invalid');
				}, 80);
			}
		}
	}

	/**
	 * @author Diego.Perez.
	 * @date 03/09/2020.
	 */
	cleanEducationForm() {
		this.type.get('degree').setValue("");
		this.type.get('attendTo').setValue("");
		this.type.get('attendFrom').setValue("");
		this.type.get('gradeAverage').setValue("");
		this.type.get('gradeScheme').setValue("");
		this.type.get('eduProvince').setValue("");
		this.type.get('eduCity').setValue("");
		this.type.get('primarylanguage').setValue("");
		this.type.get('eduAddress').setValue("");
		this.type.get('eduPostal').setValue("");
		this.type.get('counInstitu').setValue("");
		this.type.get('levEducation').setValue("");
		this.type.get('instituName').setValue("");
	}

	/**
	 * Method to save education into the data base.
	 * 
	 * @author Diego.Perez.
	 * @date 07/10/2019.
	 */
	saveEducation() {

		let url: string = '/Applicant/addEductionLevel';

		this.service.post(url, this.education).subscribe(
			(res) => {
				// console.log('ASWER: ', res)
				showNotification('top', 'right', 'success', 'The education was added successfully.');
				this.loadEducationApplicant();

				this.cleanEducationForm();

				setTimeout(() => {
					$("mat-form-field").removeClass('mat-form-field-invalid');
					$('mat-select').removeClass('mat-select-invalid');
				}, 80);

			},
			(err) => this.error = err
		)
	}

	/**
	 * Function to validate the empty fields.
	 */
	validateEducationFields() {
		let flag: boolean = true;

		if (!this.type.get('instituName').value) {
			flag = false;
		}

		// if (!this.type.get('attendFrom').value) {
		// 	flag = false;
		// }

		// if (!this.type.get('attendTo').value) {
		// 	flag = false;
		// }

		// if (!this.type.get('degree').value) {
		// 	flag = false;
		// }

		if (!this.type.get('levEducation').value) {
			flag = false;
		}

		if (!this.type.get('counInstitu').value) {
			flag = false;
		}

		// if (!this.type.get('gradeAverage').value) {
		// 	flag = false;
		// }

		// if (!this.type.get('gradeScheme').value) {
		// 	flag = false;
		// }

		return flag;
	}

	/**
	 * Function to validate the empty fields for language profile.
	 */
	validateLanguageFields() {

		let flag: boolean = true;
		let messageBox: string = '';


		if (flag && this.type.get('typeTest').value == null) {
			flag = false;
			messageBox = 'Type test is requerid.';
		}

		if (flag && this.type.get('typeTest').value != null && this.type.get('typeTest').value != 'not') {

			if (flag && this.type.get('totalScore').value == null) {
				flag = false;
				messageBox = 'The totalScore is required.';
			}

			if (flag && this.type.get('readScore').value == null) {
				flag = false;
				messageBox = 'The readScore is required.';
			}

			if (flag && this.type.get('listeScore').value == null) {
				flag = false;
				messageBox = 'The listeScore is required.';
			}

			if (flag && this.type.get('speakScore').value == null) {
				flag = false;
				messageBox = 'The speakScore is required.';
			}

			if (flag && this.type.get('writeScore').value == null) {
				flag = false;
				messageBox = 'The writeScore is required.';
			}

			if (flag && this.type.get('dateTest').value == null) {
				flag = false;
				messageBox = 'The dateTest is required.';
			}

		}

		// if (!flag) {
		// 	showNotification('top', 'right', 'warning', messageBox);
		// }

		return flag;
	}

	/**
	 * 
	 * @author Diego.Perez
	 * @date 26/06/2019
	 */
	saveTempInfo() {
		this.profile.tab = $('.card-wizard .wizard-navigation li a.nav-link.active').html();

		switch (this.profile.tab.trim()) {
			case 'Basic':
				if (this.fillProfileVars())
					this.saveProfile();

				break;

			case 'Language':
				if (this.validateLanguageFields() == true) {
					this.fillLanguageVars();
					if (this.profile.language.languageProficiencyId == null) {
						this.profile.language.languageProficiencyId = 0;
					}
					this.saveLanguage();
				}
				break;

			case 'Background':
				this.fillBackground();
				this.saveBackground();
				break;

			default:
				break;
		}

		if (this.isProfileDone) {
			this.isEducationDone = true;
		}

		this.isProfileDone = true;
		// }

	}

	/**
	 * method to save the background information profile
	 */
	saveBackground() {
		let url: string = '/Applicant/setBackgroundInfo';
		this.service.post(url, this.profile.background).subscribe(
			(res) => {
				showNotification('top', 'right', 'success', 'The background profile was saved successfully.');
			},
			(err) => {
				showNotification('top', 'right', 'warning', 'An error ocurred trying to save the background profile information.');
			}
		)
	}

	/**
	 * Method to save the profile part into the database.
	 */
	saveProfile() {
		let url: string = '/Applicant/setNewApplicant';

		this.service.post(url, this.profile).subscribe(
			(res) => {
				if (res.message == 'Ok') {
					
					this.result = res;
					this.profile.applicantId = this.result.data[0]['applicantId'];
					this.education.applicantId = this.profile.applicantId;
					showNotification('top', 'right', 'success', 'The applicant profile was saved successfully.');
					this.loadDocuments();
					
					this.updateProfile();
				}
			},
			(err) => {
				this.error = err
				showNotification('top', 'right', 'warning', 'An error ocurred trying to save the profile information. ' + err.error.message);
			}
		);
	}

	updateProfile() {
		var id = this.route.snapshot.paramMap.get('id');
        if (id != null) {
            let url = '/Applicant/getApplicant/' + id;
            this.service.getService(url).subscribe(function (res) {
					this.session = JSON.parse(localStorage.getItem('session'));
					this.session.selfApplicant.profileComplete = res.data[0].profileComplete
					localStorage.setItem('session', JSON.stringify(this.session));
            }, function (err) { });
		}
	}

	/**
	 * This function is to save the language proficiency
	 * 
	 * @author Diego.Perez.
	 * @date 07/20/2019.
	 */
	saveLanguage() {
		let url: string = '/Applicant/SetLanguageProficiency';

		this.profile.language.applicantId = this.profile.applicantId;
		this.service.post(url, this.profile.language).subscribe(
			(res) => {
				if (res.message == 'Ok') {
					showNotification('top', 'right', 'success', 'Language information was saved.');
					this.loadDocuments();
				}
			},
			(err) => {
				this.error = err;
				showNotification('top', 'right', 'error', 'An error ocurred trying to save the language information.');
			}
		)
	}

	/**
	 * Method to get all information from background.
	 */
	fillBackground() {

		if (this.profile.background.applicantId == null) {
			this.profile.background.applicantId = this.profile.applicantId;
		}

		this.profile.background.appliedVisaCan = this.type.get('appliedVisaCan').value;
		this.profile.background.prevVisaRejection = this.type.get('prev_Visa_Rejection').value;
		this.profile.background.visitedCanUsa = this.type.get('visitedCanUSA').value;
		this.profile.background.residingCanUsa = this.type.get('residingCanUSA').value;
		this.profile.background.validCanStayPermit = this.type.get('validCanStayPermit').value;
		this.profile.background.validUsastayPermit = this.type.get('validUSAStayPermit').value;

		if (this.type.get('appliedVisaCan').value.toString() == 'false' &&
			this.type.get('prev_Visa_Rejection').value.toString() == 'false' &&
			this.type.get('visitedCanUSA').value.toString() == 'false' &&
			this.type.get('residingCanUSA').value.toString() == 'false' &&
			this.type.get('validCanStayPermit').value.toString() == 'false' &&
			this.type.get('validUSAStayPermit').value.toString() == 'false') {

			this.profile.background.comments = 'N/A'; //this.type.get('backComments').value;
			this.type.get('backComments').setValue('N/A');
		} else {
			this.profile.background.comments = this.type.get('backComments').value;
		}

	}

	/**
	 * Function to get the information from language form.
	 */
	fillLanguageVars() {

		this.profile.language.testName = this.type.get('typeTest').value;

		this.profile.language.testScore = this.type.get('totalScore').value;

		this.profile.language.readingScore = this.type.get('readScore').value;

		this.profile.language.listeningScore = this.type.get('listeScore').value;

		this.profile.language.speakingScore = this.type.get('speakScore').value;

		this.profile.language.writingScore = this.type.get('writeScore').value;

		this.profile.language.testDate = this.type.get('dateTest').value;
	}

	/**
	 * Function to get the information.
	 */
	fillProfileVars() {

		let flag: Boolean = false;

		if (this.type.get("firstName").value && this.type.get("lastName").value && this.type.get("dob").value
			&& this.type.get("countryCitizen").value && this.type.get('email').value && this.type.get('maritaStatus').value
			&& this.type.get('countryProfile').value) {
			flag = true
		} else {
			flag = false;
			//showNotification('top', 'right', 'warning', 'Fill the mandatory fields.');
		}

		this.profile.firstName = this.type.get("firstName").value;
		this.profile.lastName = this.type.get("lastName").value;
		this.profile.dateOfBirth = this.type.get("dob").value;
		this.profile.citizenshipId = this.type.get("countryCitizen").value;
		this.profile.email = this.type.get('email').value;
		this.profile.maritaStatus = this.type.get('maritaStatus').value;


		this.profile.countryId = this.type.get('countryProfile').value;

		this.profile.middleName = this.type.get("middleName").value;

		this.profile.passportNumber = this.type.get("passportNumber").value;

		//console.log(this.type.get("gender").value);
		if (this.type.get("gender").value == 'other') {
			if (this.type.get("otherName").value != '')
				this.profile.gender = this.type.get("otherName").value;
			else
				this.profile.gender = this.type.get("gender").value;
		} else
			this.profile.gender = this.type.get("gender").value;

		this.profile.addressLine1 = this.type.get("addressProfile").value;

		this.profile.province = this.type.get('province').value;

		this.profile.city = this.type.get('city').value;

		this.profile.postalCode = this.type.get('zipcode').value;

		this.profile.phone = this.type.get('phone').value;

		return flag;
	}

	selectCountryChange(event: MatSelectChange) {

		this.countrySelected = <any>event;
	}

	/**
	 * Method to allow the user to delete any document that updload by error.
	 * 
	 * @param event 
	 * @param id
	 * @author Diego.Perez.
	 * @date 28/07/2019. 
	 */
	deleteDocument(event, id) {
		event.preventDefault();

		let url: string = '/Applicant/fileDelete';
		let data = {
			'DocumentName': this.profile.documentList[id].documentName,
			'ApplicantID': this.profile.documentList[id].applicantId,
			'TableID': this.profile.documentList[id].id,
			'TypeDoc': this.profile.documentList[id].typeDoc
		};

		this.service.deleteFile(url, data).subscribe(
			(res) => {
				if (res.message == 'Ok') {
					this.profile.documentList[id].documentLocation = "";
					this.profile.documentList[id].documentName = "";
					showNotification('top', 'right', 'success', 'The document was deleted successfully.');
				}
			},
			(err) => {
				showNotification('top', 'right', 'danger', 'An error ocurred trying to delete the document.');
			}
		)
	}

	/**
	 * Function to obtain information from the document view click.
	 * 
	 * @param event Object that containt the information.
	 * @param id document id.
	 * @author Diego.Perez.
	 * @date 07/27/2019.
	 */
	downloadDocument(event, id) {
		event.preventDefault();

		let data = {
			'DocumentName': this.profile.documentList[id].documentName,
			'TypeDoc': this.profile.documentList[id].typeDoc,
			'ApplicantId': this.profile.documentList[id].applicantId
		};

		let url: string = '/Applicant/fileDownload';

		this.service.downloadFile(url, data).subscribe(
			(response) => {
				this.downLoadFile(response.body, response.body.type);
			},
			(err) => {
				showNotification('top', 'right', 'danger', 'An error ocurred trying to download the document.');
			}
		)
	}

	/**
	 * Method to download a file.
	 * 
	 * @param data
	 * @param type
	 * @author Diego.Perez.
	 * @date 07/31/2019
	 */
	downLoadFile(data: any, type: string) {
		let blob = new Blob([data], { type: type });
		let url = window.URL.createObjectURL(blob);
		let pwa = window.open(url);

		if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
			showNotification('top', 'right', 'success', 'Please disable your Pop-up blocker and try again.');
		}
	}

	/**
	 * Function to get information from the document.
	 * 
	 * @param event object that allows to get the info from the document.
	 * @author Diego.Perez
	 * @date 07/04/2019.
	 */
	onDocumentChange(event, id) {

		if (this.profile.documentList == null)
			this.profile.documentList = new Array<Documento>();

		let document = new Documento();

		if (event.target.files.length > 0) {

			const file = event.target.files[0];
			//document.documentName = event.target.files[0].name;
			this.profile.documentList[id].documentName = event.target.files[0].name;//.substr(0, event.target.files[0].name.indexOf('.'));

			if (file.type == 'application/pdf') {
				this.profile.documentList[id].file = file;

				switch (event.target.name) {

					case 'Passport':
						this.type.get('Passport').setValue(file);
						break;

					case 'englishTest':

						this.type.get('englishTest').setValue(file);

						break;

					case 'transcript' + id:
						//this.type.get('transcript' + id).setValue(file);
						//document.docId = 'transcript' + id;
						//this.profile.documentList.push(document);
						break;

					case 'certificate' + id:
						//this.type.get('certificate' + id).setValue(file);
						//document.docId = 'certificate' + id;
						//this.profile.documentList.push(document);
						break;

					default:
						break;
				}


				this.saveNewDocument(this.profile.documentList[id]);
			} else {
				showNotification('top', 'right', 'warning', 'The document must be a pdf.');
			}
		}
	}

	/**
	 * Method to save the document in the database.
	 * 
	 * @param documento this is the object that containt every detail of the document.
	 * @author Diego.Perez.
	 * @date 07/23/2019.
	 */
	saveNewDocument(documento: Documento) {

		let url: string = '/Applicant/fileUpload?ApplicantID=' + documento.applicantId + '&TableID=' + documento.id + '&TypeDoc=' + documento.typeDoc;
		const formData = new FormData();
		formData.append('file', documento.file);
		this.service.postFile(url, formData).subscribe(
			(res) => {
				if (res.message == 'Ok') {
					documento.documentLocation = res.data[0].documentLocation;
					documento.documentName = res.data[0].documentName;
					showNotification('top', 'right', 'success', 'The document was saved successfully.');
				}
			},
			(err) => {
				//showNotification('top', 'right', 'danger', 'An error occurred trying to save the document.');
				showNotification('top', 'right', 'danger', err.error.message);
			}
		)
	}

	/**
	 * @author Diego.Perez
	 * @date 10/26/2019
	 */
	showMessage(index) {

		let url: string = '/Applicant/deleteEductionLevel';

		let data = {
			"educationLevelId": this.profile.education_list[index].educationLevelId
		}

		swal({
			title: 'Are you sure?',
			text: "You won't be able to revert this!",
			type: 'warning',
			showCancelButton: true,
			confirmButtonClass: 'btn btn-success',
			cancelButtonClass: 'btn btn-danger',
			confirmButtonText: 'Yes, delete it!',
			buttonsStyling: false
		}).then((result) => {
			if (result.value) {
				this.service.post(url, data).subscribe(
					(res) => {

						if (res.message == 'Ok') {
							swal(
								{
									title: 'Deleted!',
									text: 'Your education has been deleted.',
									type: 'success',
									confirmButtonClass: "btn btn-success",
									buttonsStyling: false
								}
							);
						}

						if (res.message == 'Ok')
							this.profile.education_list.splice(index, 1);
					},
					(err) => {
						console.log(err)
					}
				)
			}


		})
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

	/**
	 * @author Diego.Perez
	 * @date 06/01/2020
	 */
	emailChange() {
		if (this.checkedEmail() == false && this.emailChecked == false && this.profile.applicantId == null) {
			this.emailFocusOut();
		}
	}

	/**
	 * @author Diego.Perez
	 * @date 06/01/2020
	 */
	checkedEmail() {
		let flag: boolean;

		if (this.emailTextChecked == null || this.type.get('email').value != this.emailTextChecked) {
			this.emailChecked = false;
			flag = false;
		} else {
			flag = true;
			$('#email').focus();
		}

		return flag;
	}

	/**
	 * @author Diego.Perez
	 * @date 05/30/2020
	 */
	emailFocusOut() {
		if (this.type.get('email').value != null && this.type.get('email').value.includes('@')) {
			if (this.checkedEmail() == false) {
				let url: string = '/Applicant/emailExists/' + this.type.get('email').value;

				this.service.getService(url).subscribe(
					(res) => {
						if (res.message == 'Ok') {
							if (res.data.length > 0 && res.data[0].email != "" && res.data[0].email == this.type.get('email').value) {
								if (this.emailChecked == false) {
									showNotification('top', 'right', 'warning', 'The email typed already exist.');
								}

								this.emailTextChecked = res.data[0].email;
								this.emailChecked = true;
								$('#email').focus();
							}
						}
					},
					(err) => {
						console.log(err)
					}
				)
			}
		}
	}

	ngOnInit() {
		this.education = new Education();
		this.profile.background = new Background();

		this.type = this.formBuilder.group({
			// To add a validator, we must first convert the string value into an array. The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.
			firstName: [null, Validators.required],
			middleName: this.profile.middleName,
			lastName: [null, Validators.required],
			dob: [null, Validators.required], // this.profile.dob,
			countryCitizen: [null, [Validators.required]], //this.profile.country_citizen_code,
			passportNumber: [null, [Validators.required]], //this.profile.passportNumber,
			gender: this.profile.gender,
			otherName: [null, []],
			addressProfile: this.profile.addressLine1,
			countryProfile: [null, [Validators.required]], //this.profile.countryId,
			province: this.profile.province,
			city: this.profile.city,
			zipcode: this.profile.postalCode,
			phone: this.profile.phone,
			email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]], // [null, Validators.required],
			maritaStatus: [null, Validators.required],
			typeTest: this.profile.language.testName,
			computerBased: this.profile.language.computerBased,
			totalScore: this.profile.language.testScore,
			readScore: this.profile.language.readingScore,
			listeScore: this.profile.language.listeningScore,
			speakScore: this.profile.language.speakingScore,
			writeScore: this.profile.language.writingScore,
			dateTest: this.profile.language.testDate,

			instituName: this.education.schoolName,
			attendFrom: this.education.startDate,
			attendTo: this.education.endDate,
			degree: this.education.degree,
			levEducation: this.education.educationLevel,
			counInstitu: this.education.countryId,//[null, Validators.required],
			isRecentSchool: this.education.latestEducation,
			gradeAverage: this.education.gradeAverage,
			gradeScheme: this.education.gradeScheme,
			isGraduated: this.education.graduated,

			eduProvince: this.education.province,
			eduAddress: this.education.address,
			eduCity: this.education.city,
			eduPostal: this.education.postalCode,
			primarylanguage: this.education.primaryLanguage,

			appliedVisaCan: new FormControl('', Validators.required),
			prev_Visa_Rejection: this.profile.background.prevVisaRejection,
			visitedCanUSA: this.profile.background.visitedCanUsa,
			residingCanUSA: this.profile.background.residingCanUsa,
			validCanStayPermit: this.profile.background.validCanStayPermit,
			validUSAStayPermit: this.profile.background.validUsastayPermit,
			backComments: [null, Validators.required], //this.profile.background.comments

			Passport: [''],
			Certificate: [''],
			Transcript: ['']
		});

		this.fillBackgroundNull();

		var mainPanel = document.getElementsByClassName('main-panel')[0];
		$('.modal').on('shown.bs.modal', function () {
			mainPanel.classList.add('no-scroll');
		})
		$('.modal').on('hidden.bs.modal', function () {
			mainPanel.classList.remove('no-scroll');
		})

		// Code for the Validator
		const $validator = $('.card-wizard form').validate({
			rules: {
				lastname: {
					required: true,
					minlength: 3
				}, firstname: {
					required: true,
					minlength: 3
				},

				dob: {
					required: true,
					minlength: 8,
					maxlength: 10
				},
				countryCitizen: {
					required: true
				},
				country: {
					required: true
				}
			},

			highlight: function (element) {
				$(element).closest('.form-group').removeClass('has-success').addClass('has-danger');
			},
			success: function (element) {
				$(element).closest('.form-group').removeClass('has-danger').addClass('has-success');
			},
			errorPlacement: function (error, element) {
				$(element).append(error);
			}
		});

		// Wizard Initialization
		$('.card-wizard').bootstrapWizard({
			'tabClass': 'nav nav-pills',
			'nextSelector': '.btn-next',
			'previousSelector': '.btn-previous',

			onNext: function (tab, navigation, index) {

				var $valid = $('.card-wizard form').valid();

				let titleTemp: string = $('.card-wizard .wizard-navigation li a.nav-link.active').html();

				if (titleTemp.trim() != 'Education' && titleTemp.trim() == 'Basic') {
					if (index == 1) {
						let daty: Date = new Date($('#dob').val());

						if (!$("#firstname").val()) {
							showNotification('top', 'right', 'warning', 'You should fill the first name field!');
							$('#firstname').focus();
							return false;
						} else if (!$('#lastname').val()) {
							showNotification('top', 'right', 'warning', 'You should fill the last name field!');
							$('#lastname').focus();
							return false;
						} else if (!$('#dob').val()) {
							showNotification('top', 'right', 'warning', 'You should fill the dob field!');
							$('#dob').focus();
							return false;
						} else if ($("#countryCitizen").text() == "Country of Citizenship") {
							showNotification('top', 'right', 'warning', 'You should select the country of citizenship field!');
							$('#countryCitizen').focus();
							return false;
						} else if (!$("#passportNumber").val()) {
							showNotification('top', 'right', 'warning', 'You should fill the passport number field!');
							$('#passportNumber').focus();
							return false;
						} else if ($("#maritaStatus").text() == "Marital Status") {
							showNotification('top', 'right', 'warning', 'You should select the marital status field!');
							$('#maritaStatus').focus();
							return false;
						} else if (!$("#email").val()) {
							showNotification('top', 'right', 'warning', 'You should fill the email field!');
							$('#email').focus();
							return false;
						} else if ($("#countryProfile").text() == "Country") {
							showNotification('top', 'right', 'warning', 'You should select the country field!');
							$('#countryProfile').focus();
							return false;
						} else if (!daty.valueOf()) {
							showNotification('top', 'right', 'warning', 'You should select a valid date of birth!');
							$('#dob').focus();
							return false;
						}
					} else {
						$validator.focusInvalid();
						return false;
					}
				}

				if (!$valid) {
					if (titleTemp.trim() != 'Education' && titleTemp.trim() == 'Basic') {
						if (index != 1) {
							$validator.focusInvalid();
							return false;
						}

					}
				}
			},

			onInit: function (tab: any, navigation: any, index: any) {

				// check number of tabs and fill the entire row
				let $total = navigation.find('li').length;
				let $wizard = navigation.closest('.card-wizard');

				let $first_li = navigation.find('li:first-child a').html();
				let $moving_div = $('<div class="moving-tab">' + $first_li + '</div>');
				$('.card-wizard .wizard-navigation').append($moving_div);

				$total = $wizard.find('.nav li').length;
				let $li_width = 100 / $total;

				let total_steps = $wizard.find('.nav li').length;
				let move_distance = $wizard.width() / total_steps;
				let index_temp = index;
				let vertical_level = 0;

				let mobile_device = $(document).width() < 600 && $total > 3;

				if (mobile_device) {
					move_distance = $wizard.width() / 2;
					index_temp = index % 2;
					$li_width = 50;
				}

				$wizard.find('.nav li').css('width', $li_width + '%');

				let step_width = move_distance;
				move_distance = move_distance * index_temp;

				let $current = index + 1;

				if ($current == 1 || (mobile_device == true && (index % 2 == 0))) {
					move_distance -= 8;
				} else if ($current == total_steps || (mobile_device == true && (index % 2 == 1))) {
					move_distance += 8;
				}

				if (mobile_device) {
					let x: any = index / 2;
					vertical_level = parseInt(x);
					vertical_level = vertical_level * 38;
				}

				$wizard.find('.moving-tab').css('width', step_width);
				$('.moving-tab').css({
					'transform': 'translate3d(' + move_distance + 'px, ' + vertical_level + 'px, 0)',
					'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

				});
				$('.moving-tab').css('transition', 'transform 0s');
			},

			onTabClick: function (tab: any, navigation: any, index: any) {

				const $valid = $('.card-wizard form').valid();
				let titleTemp: string = $('.card-wizard .wizard-navigation li a.nav-link.active').html();

				if (!$valid) {

					if (titleTemp.trim() != 'Education')
						return false;
				} else {
					return true;
				}
			},

			onTabShow: function (tab: any, navigation: any, index: any) {
				let $total = navigation.find('li').length;
				let $current = index + 1;

				const $wizard = navigation.closest('.card-wizard');
				if (this.profile == null) {
					this.profile = new Profile();
				}

				this.profile.tab = $('.card-wizard .wizard-navigation li a.nav-link.active').html();
				this.currenTab = <any>$('.card-wizard .wizard-navigation li a.nav-link.active').html();
				// If it's the last tab then hide the last button and show the finish instead
				if ($current >= $total) {
					$($wizard).find('.btn-next').hide();
					$($wizard).find('.btn-finish').show();
				} else {
					$($wizard).find('.btn-next').show();
					$($wizard).find('.btn-finish').hide();
				}

				const button_text = navigation.find('li:nth-child(' + $current + ') a').html();

				setTimeout(function () {
					$('.moving-tab').text(button_text);
				}, 150);

				const checkbox = $('.footer-checkbox');

				if (index !== 0) {
					$(checkbox).css({
						'opacity': '0',
						'visibility': 'hidden',
						'position': 'absolute'
					});
				} else {
					$(checkbox).css({
						'opacity': '1',
						'visibility': 'visible'
					});
				}
				$total = $wizard.find('.nav li').length;
				let $li_width = 100 / $total;

				let total_steps = $wizard.find('.nav li').length;
				let move_distance = $wizard.width() / total_steps;
				let index_temp = index;
				let vertical_level = 0;

				let mobile_device = $(document).width() < 600 && $total > 3;

				if (mobile_device) {
					move_distance = $wizard.width() / 2;
					index_temp = index % 2;
					$li_width = 50;
				}

				$wizard.find('.nav li').css('width', $li_width + '%');

				let step_width = move_distance;
				move_distance = move_distance * index_temp;

				$current = index + 1;

				if ($current == 1 || (mobile_device == true && (index % 2 == 0))) {
					move_distance -= 8;
				} else if ($current == total_steps || (mobile_device == true && (index % 2 == 1))) {
					move_distance += 8;
				}

				if (mobile_device) {
					let x: any = index / 2;
					vertical_level = parseInt(x);
					vertical_level = vertical_level * 38;
				}

				$wizard.find('.moving-tab').css('width', step_width);
				$('.moving-tab').css({
					'transform': 'translate3d(' + move_distance + 'px, ' + vertical_level + 'px, 0)',
					'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'

				});
			}
		});


		// Prepare the preview for profile picture
		$('#wizard-picture').change(function () {
			const input = $(this);

			if (input[0].files && input[0].files[0]) {
				const reader = new FileReader();

				reader.onload = function (e: any) {
					$('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
				};
				reader.readAsDataURL(input[0].files[0]);
			}
		});

		$('[data-toggle="wizard-radio"]').click(function () {
			const wizard = $(this).closest('.card-wizard');
			wizard.find('[data-toggle="wizard-radio"]').removeClass('active');
			$(this).addClass('active');
			$(wizard).find('[type="radio"]').removeAttr('checked');
			$(this).find('[type="radio"]').attr('checked', 'true');
		});

		$('[data-toggle="wizard-checkbox"]').click(function () {
			if ($(this).hasClass('active')) {
				$(this).removeClass('active');
				$(this).find('[type="checkbox"]').removeAttr('checked');
			} else {
				$(this).addClass('active');
				$(this).find('[type="checkbox"]').attr('checked', 'true');
			}
		});

		$('.set-full-height').css('height', 'auto');

	}

	ngOnChanges(changes: SimpleChanges) {
		const input = $(this);

		if (input[0].files && input[0].files[0]) {
			const reader: any = new FileReader();

			reader.onload = function (e: any) {
				$('#wizardPicturePreview').attr('src', e.target.result).fadeIn('slow');
			};
			reader.readAsDataURL(input[0].files[0]);
		}
	}

	ngAfterViewInit() {

		$(window).resize(() => {
			$('.card-wizard').each(function () {

				const $wizard = $(this);
				const index = $wizard.bootstrapWizard('currentIndex');
				let $total = $wizard.find('.nav li').length;
				let $li_width = 100 / $total;

				let total_steps = $wizard.find('.nav li').length;
				let move_distance = $wizard.width() / total_steps;
				let index_temp = index;
				let vertical_level = 0;

				let mobile_device = $(document).width() < 600 && $total > 3;

				if (mobile_device) {
					move_distance = $wizard.width() / 2;
					index_temp = index % 2;
					$li_width = 50;
				}

				$wizard.find('.nav li').css('width', $li_width + '%');

				let step_width = move_distance;
				move_distance = move_distance * index_temp;

				let $current = index + 1;

				if ($current == 1 || (mobile_device == true && (index % 2 == 0))) {
					move_distance -= 8;
				} else if ($current == total_steps || (mobile_device == true && (index % 2 == 1))) {
					move_distance += 8;
				}

				if (mobile_device) {
					let x: any = index / 2;
					vertical_level = parseInt(x);
					vertical_level = vertical_level * 38;
				}

				$wizard.find('.moving-tab').css('width', step_width);
				$('.moving-tab').css({
					'transform': 'translate3d(' + move_distance + 'px, ' + vertical_level + 'px, 0)',
					'transition': 'all 0.5s cubic-bezier(0.29, 1.42, 0.79, 1)'
				});

				$('.moving-tab').css({
					'transition': 'transform 0s'
				});
			});
		});
	}

}
