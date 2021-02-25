import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Profile } from 'src/app/models/profile';
import { Language } from 'src/app/models/language';
import { GeneralService } from 'src/app/services/general.service';
import { ToastmsgService } from 'src/app/services/toastmsg.service';
import { MatSelectChange } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-profi-language',
	templateUrl: './profi-language.component.html',
	styleUrls: ['./profi-language.component.css']
})
export class ProfiLanguageComponent implements OnInit {

	@Input() profile: Profile;
	public isComputerTest: boolean = false;
	public testList;

	constructor(private service: GeneralService, private toast: ToastmsgService, private route: ActivatedRoute) {
		this.chargeList();
		
		if (this.route.snapshot.paramMap.get('id') != null)
			this.loadLanguageProficiency(parseInt(this.route.snapshot.paramMap.get('id')));
	}

	profileLanguage = new FormGroup({
		typeTest: new FormControl(''),
		computerBased: new FormControl(''),
		totalScore: new FormControl(''),
		readScore: new FormControl(''),
		listeScore: new FormControl(''),
		speakScore: new FormControl(''),
		writeScore: new FormControl(''),
		dateTest: new FormControl(''),
	});

	ngOnInit() {
	}

	/**
	 * Function to load the language information applicant.
	 * 
	 * @author Diego.Perez.
	 * @date 07/20/2019.
	 */
	loadLanguageProficiency(applicantId: number) {

		let id;
		if (this.route.snapshot.paramMap.get('id') == null) {
			id = this.profile.applicantId;
		} else if (this.route.snapshot.paramMap.get('id') != null) {
			id = this.route.snapshot.paramMap.get('id');
		}

		if (applicantId > 0)
			id = applicantId;		

		if (id) {
			let url: string = '/Applicant/getLanguageProficiency/' + id;

			this.service.getService(url).subscribe(
				(res) => {

					this.fillLanguageVarsLoad(res.data);
				},
				(err) => {
					console.log(err)
				}
			)
		}
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

			this.profileLanguage.get('typeTest').setValue(parseInt(this.profile.language.testName));
			this.profileLanguage.get('computerBased').setValue(this.profile.language.computerBased);
			this.profileLanguage.get('totalScore').setValue(this.profile.language.testScore);
			this.profileLanguage.get('readScore').setValue(this.profile.language.readingScore);
			this.profileLanguage.get('listeScore').setValue(this.profile.language.listeningScore);
			this.profileLanguage.get('speakScore').setValue(this.profile.language.speakingScore);
			this.profileLanguage.get('writeScore').setValue(this.profile.language.writingScore);
			this.profileLanguage.get('dateTest').setValue(this.profile.language.testDate);
		}

		//this.loadBackgroundInfo();

	}

	chargeList() {
		let url: string = '/school/getEnglishExamList';
		this.service.getService(url).subscribe(
			(res) => {
				this.testList = res;
			},
			(err) => {
				console.log(err)
			}
		);
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

	isFieldValid(form: FormGroup, field: string) {
		return !form.get(field).valid && form.get(field).touched;
	}

	displayFieldCss(form: FormGroup, field: string) {
		return {
			'has-error': this.isFieldValid(form, field),
			'has-feedback': this.isFieldValid(form, field)
		};
	}

	emailFormControl = new FormControl('', [
		Validators.required,
		Validators.email,
	]);

	/**
	 * @author Diego.Perez
	 * @date 07/04/2020
	 */
	sendLanguage() {
		if (this.validateLanguageFields() == true) {
			this.fillLanguageVars();
			if (this.profile.language.languageProficiencyId == null) {
				this.profile.language.languageProficiencyId = 0;
			}
			this.saveLanguage();
		}
	}

	/**
	 * Function to validate the empty fields for language profile.
	 */
	validateLanguageFields() {

		let flag: boolean = true;
		let messageBox: string = '';


		if (flag && (this.profileLanguage.get('typeTest').value == null || this.profileLanguage.get('typeTest').value == '')) {
			flag = false;
			messageBox = 'Type test is requerid.';
		}

		if (flag && this.profileLanguage.get('typeTest').value != null && this.profileLanguage.get('typeTest').value != 'not') {

			if (flag && this.profileLanguage.get('totalScore').value == null) {
				flag = false;
				messageBox = 'The totalScore is required.';
			}

			if (flag && this.profileLanguage.get('readScore').value == null) {
				flag = false;
				messageBox = 'The readScore is required.';
			}

			if (flag && this.profileLanguage.get('listeScore').value == null) {
				flag = false;
				messageBox = 'The listeScore is required.';
			}

			if (flag && this.profileLanguage.get('speakScore').value == null) {
				flag = false;
				messageBox = 'The speakScore is required.';
			}

			if (flag && this.profileLanguage.get('writeScore').value == null) {
				flag = false;
				messageBox = 'The writeScore is required.';
			}

			if (flag && this.profileLanguage.get('dateTest').value == null) {
				flag = false;
				messageBox = 'The dateTest is required.';
			}

		}
		
		return flag;
	}

	/**
	 * Function to get the information from language form.
	 */
	fillLanguageVars() {
		
		this.profile.language.testName = this.profileLanguage.get('typeTest').value;
		this.profile.language.testScore = this.profileLanguage.get('totalScore').value;
		this.profile.language.readingScore = this.profileLanguage.get('readScore').value;
		this.profile.language.listeningScore = this.profileLanguage.get('listeScore').value;
		this.profile.language.speakingScore = this.profileLanguage.get('speakScore').value;
		this.profile.language.writingScore = this.profileLanguage.get('writeScore').value;
		this.profile.language.testDate = this.profileLanguage.get('dateTest').value;
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
					this.toast.showNotification('top', 'right', 'success', 'Language information was saved.');
					//this.loadDocuments();
				}
			},
			(err) => {
				console.log(err);
				this.toast.showNotification('top', 'right', 'error', 'An error ocurred trying to save the language information.');
			}
		)
	}

}
