import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material';
import { FormControl, FormGroupDirective, NgForm, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { PasswordValidation } from './password-validator.component';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { showNotification } from 'src/app/toast-message/toast-message';

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

@Component({
	selector: 'app-userpassword',
	templateUrl: './userpassword.component.html',
	styleUrls: ['./userpassword.component.css']
})
export class UserpasswordComponent implements OnInit {

	emailFormControl = new FormControl('', [
		Validators.required,
		Validators.email,
	]);

	register: FormGroup;
	validConfirmPasswordRegister: boolean = false;
	validPasswordRegister: boolean = false;
	newValidPasswordRegister: boolean = false;

	constructor(private formBuilder: FormBuilder, private router: Router, private service: GeneralService) {
		if (localStorage.getItem('session') === null || JSON.parse(localStorage.getItem('session')).id == 0) {
			this.router.navigate(['/login']);
		} else {
			console.log('continue'); //JSON.parse(localStorage.getItem('session')).username);
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

	ngOnInit() {

		this.register = this.formBuilder.group({
			// To add a validator, we must first convert the string value into an array. The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.
			userId: [null, Validators.required],
			//password: [null, Validators.required],
			// We can use more than one validator per field. If we want to use more than one validator we have to wrap our array of validators with a Validators.compose function. Here we are using a required, minimum length and maximum length validator.
			//optionsCheckboxes: ['', Validators.required],
			oldPassword: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
			password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
			confirmPassword: ['', Validators.required],
		}, {
			validator: PasswordValidation.MatchPassword // your validation method
		});

		this.register.get('userId').setValue(JSON.parse(localStorage.getItem('session')).username);
	}

	/**
	 * @author Diego.Perez
	 * @date 11/16/2019
	 */
	newPasswordValidationRegister(e) {
		if (e.length > 5) {
			this.newValidPasswordRegister = true;
		} else {
			this.newValidPasswordRegister = false;
		}
	}

	/**
	 * @author Diego.Perez
	 * @date 11/16/2019
	 */
	passwordValidationRegister(e) {
		if (e.length > 5) {
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

	/**
	 * @author Diego.Perez
	 * @date 11/16/2019
	 */
	onRegister() {

		let url: string = '/user/modifyPassword';
		let data = {
			'oldPassword': this.register.get('oldPassword').value,
			'newPassword': this.register.get('password').value,
			'newPasswordRepeat': this.register.get('confirmPassword').value
		}

		if (this.register.valid) {
			this.service.post(url, data).subscribe(
				(res) => {
					if (res.message == 'Ok') {
						this.router.navigate(['/lock']);
					}
				},
				(err) => {
					console.log(err)
					showNotification('top', 'right', 'danger', '' + err.error.message + '<br>' + err.error.data)
				}
			)
		} else {
			this.validateAllFormFields(this.register);

		}
	}

}
