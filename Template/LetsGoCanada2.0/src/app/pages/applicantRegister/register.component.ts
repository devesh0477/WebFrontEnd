import { Component, OnInit, OnDestroy } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { FormGroup, Validators, FormControl, FormBuilder, FormGroupDirective, NgForm } from '@angular/forms';
import { PasswordValidation } from 'src/app/admin/userpassword/password-validator.component';
import { ErrorStateMatcher } from '@angular/material';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';

declare const $: any;

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

@Component({
	selector: 'app-applicant-register-cmp',
	templateUrl: './applicant-register.component.html',
	styleUrls: ['./applicant-register.component.css']
})

export class ApplicantRegisterComponent implements OnInit, OnDestroy, NotificationsComponent {

	emailFormControl = new FormControl('', [
		Validators.required,
		Validators.email,
	]);

	test: Date = new Date();
	validEmailRegister: boolean = false;
	validPasswordRegister: boolean = false;
	validConfirmPasswordRegister: boolean = false;

	register: FormGroup;
	public applicant = {
		'userLogin':
		{
			'email': '',
			'password': ''
		},
		'Applicant': {
			'FirstName': ''
		}
	};


	constructor(private service: GeneralService, private formBuilder: FormBuilder) { }

	isFieldValid(form: FormGroup, field: string) {
		return !form.get(field).valid && form.get(field).touched;
	}

	displayFieldCss(form: FormGroup, field: string) {
		return {
			'has-error': this.isFieldValid(form, field),
			'has-feedback': this.isFieldValid(form, field)
		};
	}

	validateAllFormFields(formGroup: FormGroup) {
		Object.keys(formGroup.controls).forEach(field => {
			const control = formGroup.get(field);
			if (control instanceof FormControl) {
				control.markAsTouched({ onlySelf: true });
			} else if (control instanceof FormGroup) {
				this.validateAllFormFields(control);
			}
		});
	}

	emailValidationRegister(e) {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		if (re.test(String(e).toLowerCase())) {
			this.validEmailRegister = true;
		} else {
			this.validEmailRegister = false;
		}
	}

	/**
	 * @author Diego.Perez
	 * @date 11/16/2019
	 */
	passwordValidationRegister(e) {
		if (e != null && e.length > 5) {
			this.validPasswordRegister = true;
		} else {
			this.validPasswordRegister = false;
		}
	}

	/**
	 * @author Diego.Perez
	 * @date 11/16/2019
	 */
	confirmPasswordValidationRegister(e) {
		if (this.register.controls['password'].value === e) {
			this.validConfirmPasswordRegister = true;
		} else {
			this.validConfirmPasswordRegister = false;
		}
	}

	ngOnInit() {
		const body = document.getElementsByTagName('body')[0];
		body.classList.add('register-page');
		body.classList.add('off-canvas-sidebar');

		this.register = this.formBuilder.group({
			// To add a validator, we must first convert the string value into an array. The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.
			applicantName: [null, Validators.required],
			email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
			//password: [null, Validators.required],
			// We can use more than one validator per field. If we want to use more than one validator we have to wrap our array of validators with a Validators.compose function. Here we are using a required, minimum length and maximum length validator.
			//optionsCheckboxes: ['', Validators.required],
			//oldPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
			confirmPassword: [null, Validators.required],
		},
			{
				validator: PasswordValidation.MatchPassword // your validation method
			}
		);
	}

	ngOnDestroy() {
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('register-page');
		body.classList.remove('off-canvas-sidebar');
	}

	/**
	 * 
	 * @param event 
	 * @author Diego.Perez
	 * @date 11/18/2019
	 */
	registerUser(event) {
		event.preventDefault();
		let url: string = '/applicant/setNewSelfApplicant';
		if (this.fillRegister()) {
			console.log(this.applicant)
			if (this.register.valid) {
				this.service.noAuthenticationPost(url, this.applicant).subscribe(
					(res) => {
						console.log(res)
						this.resetForm();
						this.showNotification('top', 'right', 'success', 'The user was registered.');
					},
					(err) => {
						this.showNotification('top', 'right', 'danger', 'An error occurred trying to register the user.');
						console.log(err);
					}
				)
			} else {
				this.showNotification('top', 'right', 'danger', 'Fill the inputs in the proper way.');
				console.log('something is nos valid in the form');
			}
		} else {
			this.showNotification('top', 'right', 'danger', 'Some inputs are not filled.');
			console.log('one of the inputs is not filled');
		}

	}

	/**
	 * @author Diego.Perez
	 * @date 11/23/2019
	 */
	resetForm() {
		this.applicant.userLogin.email = '';
		this.register.get('email').setValue('');
		this.applicant.userLogin.password = '';
		this.register.get('password').setValue('');
		this.applicant.Applicant.FirstName = '';
		this.register.get('applicantName').setValue('');
		this.register.reset();
	}

	/**
	 * @author Diego.Perez
	 * @date 11/23/2019
	 */
	fillRegister() {

		let flag: boolean = true;

		if (this.register.get('email').value)
			this.applicant.userLogin.email = this.register.get('email').value;
		else
			flag = false

		if (this.register.get('password').value)
			this.applicant.userLogin.password = this.register.get('password').value;
		else
			flag = false;

		if (this.register.get('applicantName').value)
			this.applicant.Applicant.FirstName = this.register.get('applicantName').value;
		else
			flag = false;


		return flag;
	}

	/**
	 * 
	 * @param from 
	 * @param align 
	 * @param type1 
	 * @param messages
	 * @date 11/23/2019. 
	 */
	showNotification(from: any, align: any, type: any, messages: any): void {
		$.notify({
			icon: 'notifications',
			message: messages //'Welcome to <b>Material Dashboard</b> - a beautiful dashboard for every web developer.'
		}, {
			type: type,//[color],
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

}