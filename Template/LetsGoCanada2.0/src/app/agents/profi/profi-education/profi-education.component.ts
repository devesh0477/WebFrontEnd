import { Component, OnInit, Input } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { Education } from 'src/app/models/education';
import { Profile } from 'src/app/models/profile';
import { ToastmsgService } from 'src/app/services/toastmsg.service';
import swal from 'sweetalert2';
import { ComunicationService } from 'src/app/services/comunication.service';

declare const $: any;

@Component({
	selector: 'app-profi-education',
	templateUrl: './profi-education.component.html',
	styleUrls: ['./profi-education.component.css']
})
export class ProfiEducationComponent implements OnInit {

	@Input() profile: Profile;
	public education_list: Array<Education>;
	public educationLevels;
	public butname: string = "add";
	public btnToolTip: string = "Save";
	public education: Education;
	public isMostRecentStudy: boolean = false;
	public isgraduatedStudy: boolean = false;
	public countries;
	public gradeSchemeList;

	constructor(private route: ActivatedRoute, private service: GeneralService, private toast: ToastmsgService, private communication: ComunicationService) {
		this.chargeApiList();
		//this.loadEducationApplicant();
	}

	profileEducation = new FormGroup({
		instituName: new FormControl(''),
		attendFrom: new FormControl(''),
		attendTo: new FormControl(''),
		degree: new FormControl(''),
		levEducation: new FormControl(''),
		counInstitu: new FormControl(''),
		isRecentSchool: new FormControl(''),
		gradeAverage: new FormControl(''),
		gradeScheme: new FormControl(''),
		isGraduated: new FormControl(''),

		eduProvince: new FormControl(''),
		eduAddress: new FormControl(''),
		eduCity: new FormControl(''),
		eduPostal: new FormControl(''),
		primarylanguage: new FormControl('')
	});

	ngOnInit() {
		this.education = new Education();

		this.loadEducationApplicant();
	}

	/**
	 * Function to charge all the list in the component from the API.
	 * 
	 * @author Diego.Perez
	 * @date 07/02/2020
	 */
	chargeApiList() {

		let url: string = '/Applicant/getEducationTypeList';
		this.service.getService(url).subscribe(
			(res) => {
				this.educationLevels = res.data;
			},
			(err) => {
				console.log('Error getting education type list.', err)
			}
		);

		url = '/Applicant/getCountryNationality';

		this.service.getService(url).subscribe(
			(res) => {
				this.countries = res.data;
			},
			(err) => {
				console.log(err)
			}
		);

		url = '/Applicant/getGradeSchemeList';
		this.service.getService(url).subscribe(
			(res) => {
				this.gradeSchemeList = res.data;
			},
			(err) => {
				console.log(err)
			}
		);
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
	 * Function to load the education information.
	 * 
	 * @author Diego.Perez.
	 * @date 07/10/2019.
	 */
	loadEducationApplicant() {
		// let url: string = '/Applicant/getEductionLevel/' + this.profile.applicantId;
		let id: number = parseInt(this.route.snapshot.paramMap.get('id'));
		//console.log('THE ID: ', id, ' AND PROFILE ID: ', this.profile.applicantId);
		if (!isNaN(this.profile.applicantId) && (isNaN(id) || id == null || id == 0)) {
			id = this.profile.applicantId;
		}	

		if(this.profile.applicantId == null && id != null){
			this.profile.applicantId = id;
		}
		
		if (!isNaN(id)) {

			let url: string = '/Applicant/getEductionLevel/' + id;
			this.service.getService(url).subscribe(
				(res) => {
					//this.result = res;				
					this.fillEducationVarsLoad(res.data);
				},
				(err) => {
					console.log(err)
				}
			);
		}

		return false;
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

			this.profile.education_list.push(educa);

			i = i + 1;

		});
		//this.loadLanguageProficiency();

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

				this.education.schoolName = this.profileEducation.get('instituName').value;
				this.education.startDate = this.profileEducation.get('attendFrom').value;
				this.education.endDate = this.profileEducation.get('attendTo').value;
				this.education.degree = this.profileEducation.get('degree').value;

				//this.education.lev_education_code = this.type.get('levEducation').value;
				this.education.educationTypeId = this.profileEducation.get('levEducation').value;
				this.education.countryId = this.profileEducation.get('counInstitu').value;
				this.education.gradeAverage = this.profileEducation.get('gradeAverage').value;
				this.education.gradeScheme = this.profileEducation.get('gradeScheme').value;

				this.education.latestEducation = this.isMostRecentStudy;
				this.isMostRecentStudy = false;
				this.education.graduated = this.isgraduatedStudy;
				this.isgraduatedStudy = false;

				this.education.province = this.profileEducation.get('eduProvince').value;
				this.education.city = this.profileEducation.get('eduCity').value;
				this.education.primaryLanguage = this.profileEducation.get('primarylanguage').value;
				this.education.address = this.profileEducation.get('eduAddress').value;
				this.education.postalCode = this.profileEducation.get('eduPostal').value;

				this.education.applicantId = this.profile.applicantId;

				if (this.education.educationLevelId == null)
					this.education.educationLevelId = 0;

				this.saveEducation();

				this.butname = "add";
				this.btnToolTip = "Save";
			} else {
				this.toast.showNotification('top', 'right', 'danger', 'Education not added! Please check the mandatory fields.');
				setTimeout(() => {
					$("mat-form-field.testy").addClass('mat-form-field-invalid');
					$('mat-select.testy').addClass('mat-select-invalid');
				}, 80);
			}
		}
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

				this.toast.showNotification('top', 'right', 'success', 'The education was added successfully.');
				this.loadEducationApplicant();
				this.communication.sendProcess(this.profile);
				this.cleanEducationForm();

				setTimeout(() => {
					$("mat-form-field").removeClass('mat-form-field-invalid');
					$('mat-select').removeClass('mat-select-invalid');
				}, 80);

			},
			(err) => {
				console.log(err)
			}
		)
	}

	/**
	 * @author Diego.Perez.
	 * @date 03/09/2020.
	 */
	cleanEducationForm() {
		this.profileEducation.get('degree').setValue("");
		this.profileEducation.get('attendTo').setValue("");
		this.profileEducation.get('attendFrom').setValue("");
		this.profileEducation.get('gradeAverage').setValue("");
		this.profileEducation.get('gradeScheme').setValue("");
		this.profileEducation.get('eduProvince').setValue("");
		this.profileEducation.get('eduCity').setValue("");
		this.profileEducation.get('primarylanguage').setValue("");
		this.profileEducation.get('eduAddress').setValue("");
		this.profileEducation.get('eduPostal').setValue("");
		this.profileEducation.get('counInstitu').setValue("");
		this.profileEducation.get('levEducation').setValue("");
		this.profileEducation.get('instituName').setValue("");
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

			this.education.schoolName = this.profileEducation.get('instituName').value;
			this.education.startDate = this.profileEducation.get('attendFrom').value;
			this.education.endDate = this.profileEducation.get('attendTo').value;
			this.education.degree = this.profileEducation.get('degree').value;

			this.education.educationTypeId = this.profileEducation.get('levEducation').value;
			this.education.countryId = this.profileEducation.get('counInstitu').value;
			this.education.gradeAverage = this.profileEducation.get('gradeAverage').value;
			this.education.latestEducation = this.profileEducation.get('isRecentSchool').value;
			this.education.latestEducation = this.isMostRecentStudy;

			this.education.graduated = this.profileEducation.get('isGraduated').value;
			this.education.graduated = this.isgraduatedStudy;

			this.education.primaryLanguage = this.profileEducation.get('primarylanguage').value;
			this.education.province = this.profileEducation.get('eduProvince').value;
			this.education.city = this.profileEducation.get('eduCity').value;
			this.education.address = this.profileEducation.get('eduAddress').value;
			this.education.postalCode = this.profileEducation.get('eduPostal').value;

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

		this.profileEducation.get('instituName').setValue(this.profile.education_list[event.currentTarget.id].schoolName);
		this.profileEducation.get('attendFrom').setValue(this.profile.education_list[event.currentTarget.id].startDate);
		this.profileEducation.get('attendTo').setValue(this.profile.education_list[event.currentTarget.id].endDate);
		this.profileEducation.get('degree').setValue(this.profile.education_list[event.currentTarget.id].degree);

		this.profileEducation.get('levEducation').setValue(this.profile.education_list[event.currentTarget.id].educationTypeId);
		this.profileEducation.get('counInstitu').setValue(this.profile.education_list[event.currentTarget.id].countryId);
		this.profileEducation.get('gradeAverage').setValue(this.profile.education_list[event.currentTarget.id].gradeAverage);
		this.profileEducation.get('isRecentSchool').setValue(this.profile.education_list[event.currentTarget.id].latestEducation);
		this.isMostRecentStudy = this.profile.education_list[event.currentTarget.id].latestEducation;

		this.profileEducation.get('isGraduated').setValue(this.profile.education_list[event.currentTarget.id].graduated);
		this.isgraduatedStudy = this.profile.education_list[event.currentTarget.id].graduated;

		this.profileEducation.get('primarylanguage').setValue(this.profile.education_list[event.currentTarget.id].primaryLanguage);
		this.profileEducation.get('eduProvince').setValue(this.profile.education_list[event.currentTarget.id].province);
		this.profileEducation.get('eduCity').setValue(this.profile.education_list[event.currentTarget.id].city);
		this.profileEducation.get('eduAddress').setValue(this.profile.education_list[event.currentTarget.id].address);

		this.profileEducation.get('eduPostal').setValue(this.profile.education_list[event.currentTarget.id].postalCode);

		this.education.idHtml = position;

		this.education.educationLevelId = this.profile.education_list[event.currentTarget.id].educationLevelId;
		this.education.applicantId = this.profile.education_list[event.currentTarget.id].applicantId;
		this.education.schoolName = this.profile.education_list[event.currentTarget.id].schoolName;
		this.education.educationLevel = this.profile.education_list[event.currentTarget.id].educationLevel;
		this.education.countryName = this.profile.education_list[event.currentTarget.id].countryName;

		this.profile.education_list.splice(position, 1);
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
	 * Function to validate the empty fields.
	 */
	validateEducationFields() {
		let flag: boolean = true;

		if (!this.profileEducation.get('instituName').value) {
			flag = false;
		}

		if (!this.profileEducation.get('levEducation').value) {
			flag = false;
		}

		if (!this.profileEducation.get('counInstitu').value) {
			flag = false;
		}

		return flag;
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

}
