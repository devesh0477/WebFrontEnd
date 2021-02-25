import { Component, OnInit } from '@angular/core';
import { Profile } from 'src/app/models/profile';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { validateConfig } from '@angular/router/src/config';
import { GeneralService } from 'src/app/services/general.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastmsgService } from 'src/app/services/toastmsg.service';
import { Observable, of } from 'rxjs';

declare const $: any;

@Component({
	selector: 'app-profi-basic',
	templateUrl: './profi-basic.component.html',
	styleUrls: ['./profi-basic.component.css']
})
export class ProfiBasicComponent implements OnInit {

	/**
	 * Create a observable.
	 * @author Deivid Mafra
	 * @date 07/07/2020
	 */
	observable = Observable.create((observer) => {
		observer.next();
	});

	emailFormControl = new FormControl('', [
		Validators.required,
		Validators.email,
	]);

	public profile: Profile = new Profile();
	public otherGender: boolean = false;
	public countries;
	public maxDate: Date;
	public minDate: Date;
	public session;
	public marital;
	public emailChecked: boolean = false;
	public emailTextChecked: string = '';
	profiForm: FormGroup;


	constructor(private service: GeneralService, private route: ActivatedRoute, private toast: ToastmsgService, private router: Router) {

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

			this.chargeApiList();
			this.loadApplicant();
		}

	}

	ngOnInit() {

		this.profile = new Profile();

		this.profiForm = new FormGroup({
			firstName: new FormControl('', Validators.required),
			middleName: new FormControl(''),
			lastName: new FormControl('', Validators.required),
			dateOfBirth: new FormControl('', Validators.required),
			// profileComplete: new FormControl({ value: '', disabled: true }),
			countryCitizen: new FormControl('', Validators.required),
			passportNumber: new FormControl('', Validators.required),
			gender: new FormControl(''),
			otherName: new FormControl(''),
			addressLine1: new FormControl(''),
			countryProfile: new FormControl('', Validators.required),
			province: new FormControl(''),
			city: new FormControl(''),
			postalCode: new FormControl(''),
			phone: new FormControl(''),
			email: new FormControl('', Validators.required),
			maritaStatus: new FormControl('', Validators.required),
		});
	}

	onOtherChange() {
		this.otherGender = true;
	}

	onMaFeChange() {
		this.otherGender = false;
	}

	/**
	 * @author Diego.Perez
	 * @date 06/29/2020
	 **/
	public prepareProfile = new Observable((observer) => {

		if (this.fillProfileVars()) {

			let url: string = '/Applicant/setNewApplicant';

			this.service.post(url, this.profile).subscribe(
				(res) => {
					if (res.message == 'Ok') {


						this.profile.applicantId = res.data[0]['applicantId'];
						//this.education.applicantId = this.profile.applicantId;
						this.toast.showNotification('top', 'right', 'success', 'The applicant profile was saved successfully.');
						//this.loadDocuments();

						this.updateProfile();
						//return this.profile;

						observer.next(this.profile);
						observer.complete();
					}
				},
				(err) => {
					console.log(err)
					this.toast.showNotification('top', 'right', 'warning', 'An error ocurred trying to save the profile information. ' + err.error.message);
					//return new Profile();
				}
			);

		} else {
			observer.next(false);
			observer.complete();
		}
	});

	//prepareProfile(): boolean {
	// let flag: Boolean;
	// if(this.profiForm.valid && this.fillProfileVars()) {
	// 	this.profile = this.saveProfile();
	// console.log('Come here')

	// return flag = true;
	// } else {
	// return flag = false;
	// }	

	//}

	/**
	 * Function to get the information.
	 * @author Diego.Perez
	 * @date 07/01/2020
	 */
	fillProfileVars(): boolean {

		let flag: boolean = false;

		if (this.profiForm.get("firstName").value && this.profiForm.get("lastName").value && this.profiForm.get("dateOfBirth").value
			&& this.profiForm.get("countryCitizen").value && this.profiForm.get('email').value && this.profiForm.get('maritaStatus').value
			&& this.profiForm.get('countryProfile').value) {
			flag = true
		} else {
			flag = false;
		}

		this.profile.firstName = this.profiForm.get("firstName").value;
		this.profile.lastName = this.profiForm.get("lastName").value;
		this.profile.dateOfBirth = this.profiForm.get("dateOfBirth").value;
		this.profile.citizenshipId = this.profiForm.get("countryCitizen").value;
		this.profile.email = this.profiForm.get('email').value;
		this.profile.maritaStatus = this.profiForm.get('maritaStatus').value;
		this.profile.countryId = this.profiForm.get('countryProfile').value;
		this.profile.middleName = this.profiForm.get("middleName").value;
		this.profile.passportNumber = this.profiForm.get("passportNumber").value;

		if (this.profiForm.get("gender").value == 'other') {
			if (this.profiForm.get("otherName").value != '')
				this.profile.gender = this.profiForm.get("otherName").value;
			else
				this.profile.gender = this.profiForm.get("gender").value;
		} else
			this.profile.gender = this.profiForm.get("gender").value;

		this.profile.addressLine1 = this.profiForm.get("addressLine1").value;
		this.profile.province = this.profiForm.get('province').value;
		this.profile.city = this.profiForm.get('city').value;
		this.profile.postalCode = this.profiForm.get('postalCode').value;
		this.profile.phone = this.profiForm.get('phone').value;

		return flag;
	}

	/**
	 * Method to save the profile part into the database.
	 * @author Diego.Perez
	 * @date 07/01/2020
	 */
	public saveProfile(): Profile | void {

		let url: string = '/Applicant/setNewApplicant';

		this.service.post(url, this.profile).subscribe(
			(res) => {
				if (res.message == 'Ok') {

					this.profile.applicantId = res.data[0]['applicantId'];
					//this.education.applicantId = this.profile.applicantId;
					this.toast.showNotification('top', 'right', 'success', 'The applicant profile was saved successfully.');
					//this.loadDocuments();

					this.updateProfile();
					return this.profile;
				}
			},
			(err) => {
				console.log(err)
				this.toast.showNotification('top', 'right', 'warning', 'An error ocurred trying to save the profile information. ' + err.error.message);
				return new Profile();
			}
		);
	}

	updateProfile() {
		let id = this.route.snapshot.paramMap.get('id');
		if (id != null) {
			let url = '/Applicant/getApplicant/' + id;
			this.service.getService(url).subscribe(function (res) {
				//It doesnt make sense updates the session with the current sesion. I will delete this row.
				this.session = JSON.parse(localStorage.getItem('session'));
				if(res.data[0].profileComplete != null){
					this.session.selfApplicant.profileComplete = res.data[0].profileComplete
				}
				localStorage.setItem('session', JSON.stringify(this.session));
			}, function (err) { });
		}
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

					this.fillProfileVarsLoad(res.data);
				},
				(err) => {
					console.log(err)
				}
			)
		}
	}

	/**
	 * Function to fill all the fields when the applicant exist.
	 */
	fillProfileVarsLoad(res) {

		this.profile.applicantId = res[0]['applicantId'];
		this.profiForm.get('firstName').setValue(res[0]['firstName']);
		this.profiForm.get('lastName').setValue(res[0]['lastName']);
		this.profiForm.get('middleName').setValue(res[0]['middleName']);
		this.profiForm.get('dateOfBirth').setValue(res[0]['dateOfBirth']);
		this.profiForm.get('countryCitizen').setValue(res[0]['citizenshipId']);
		this.profiForm.get('province').setValue(res[0]['province']);
		this.profiForm.get('passportNumber').setValue(res[0]['passportNumber']);

		this.profiForm.get('addressLine1').setValue(res[0]['addressLine1']);
		this.profiForm.get('countryProfile').setValue(res[0]['countryId']);

		this.profiForm.get('phone').setValue(res[0]['phone']);
		this.profiForm.get('postalCode').setValue(res[0]['postalCode']);
		this.profiForm.get('email').setValue(res[0]['email']);
		this.profiForm.get('city').setValue(res[0]['city']);
		this.profiForm.get('maritaStatus').setValue(res[0]['maritaStatus']);


		if (res[0]['gender'] != 'male' && res[0]['gender'] != 'female') {
			this.otherGender = true;
			if (res[0]['gender'] != 'other') {
				this.profiForm.get('otherName').setValue(res[0]['gender']);
				this.profiForm.get('gender').setValue('other');
			}
		} else
			this.profiForm.get('gender').setValue(res[0]['gender']);

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
				this.countries = res.data;
			},
			(err) => {
				console.log(err)
			}
		);

		url = '/Applicant/getMaritalStatus';
		this.service.getService(url).subscribe(
			(res) => {
				this.marital = res;
			},
			(err) => {
				console.log(err)
			}
		);
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

		if (this.emailTextChecked == null || this.profiForm.get('email').value != this.emailTextChecked) {
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
		if (this.profiForm.get('email').value != null && this.profiForm.get('email').value.includes('@')) {
			if (this.checkedEmail() == false) {
				let url: string = '/Applicant/emailExists/' + this.profiForm.get('email').value;

				this.service.getService(url).subscribe(
					(res) => {
						if (res.message == 'Ok') {
							if (res.data.length > 0 && res.data[0].email != "" && res.data[0].email == this.profiForm.get('email').value) {
								if (this.emailChecked == false) {
									this.toast.showNotification('top', 'right', 'warning', 'The email typed already exist.');
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

	isFieldValid(form: FormGroup, field: string) {
		return !form.get(field).valid && form.get(field).touched;
	}

	displayFieldCss(form: FormGroup, field: string) {
		return {
			'has-error': this.isFieldValid(form, field),
			'has-feedback': this.isFieldValid(form, field)
		};
	}

}
