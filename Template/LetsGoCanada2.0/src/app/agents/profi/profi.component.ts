import { Component, OnInit, OnChanges, AfterViewInit, SimpleChanges } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { FormBuilder } from '@angular/forms';
import { ProfiBasicComponent } from './profi-basic/profi-basic.component';
import { ToastmsgService } from 'src/app/services/toastmsg.service';
import { showNotification } from 'src/app/toast-message/toast-message';
import { Profile } from 'src/app/models/profile';
import { ProfiEducationComponent } from './profi-education/profi-education.component';
import { ProfiLanguageComponent } from './profi-language/profi-language.component';
import { ProfiBackgroundComponent } from './profi-background/profi-background.component';
import { ProfiDocumentsComponent } from './profi-documents/profi-documents.component';

declare const $: any;

interface FileReaderEventTarget extends EventTarget {
	result: string;
}

interface FileReaderEvent extends Event {
	target: EventTarget;
	getMessage(): string;
}

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

@Component({
	selector: 'app-profi',
	templateUrl: './profi.component.html',
	styleUrls: ['./profi.component.css']
})
export class ProfiComponent implements OnInit {

	emailFormControl = new FormControl('', [
		Validators.required,
		Validators.email,
	]);

	matcher = new MyErrorStateMatcher();
	public profile: Profile = new Profile();

	constructor(private formBuilder: FormBuilder, private toastmsg: ToastmsgService) { }

	/**
	 * @param profileForm
	 * @author Diego.Perez
	 * @date 06/29/2020
	 */
	saveProfile(profileForm: ProfiBasicComponent, educationForm: ProfiEducationComponent, languageForm: ProfiLanguageComponent,
		backgroundForm: ProfiBackgroundComponent, documentsForm: ProfiDocumentsComponent): void {
		let tab: string = $('.card-wizard .wizard-navigation li a.nav-link.active').html();

		if (tab.trim() == 'Basic') {

			profileForm.prepareProfile.subscribe(
				(res: Profile) => {

					this.profile = res;

					if (this.profile.applicantId > 0) {
						educationForm.loadEducationApplicant();
						languageForm.loadLanguageProficiency(this.profile.applicantId);
						backgroundForm.loadBackgroundInfo(this.profile.applicantId);
						documentsForm.loadDocuments(this.profile.applicantId);
					}
				},
				(err) => {
					console.log('Error ->: ', err)
				}
			);

		} else if (tab.trim() == 'Education') {
			documentsForm.loadDocuments(this.profile.applicantId);
		} else if (tab.trim() == 'Language') {
			languageForm.sendLanguage();
			documentsForm.loadDocuments(this.profile.applicantId);
		} else if (tab.trim() == 'Background') {
			backgroundForm.sendBackground();
			documentsForm.loadDocuments(this.profile.applicantId);
		} else {
			documentsForm.loadDocuments(this.profile.applicantId);
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

	ngOnInit() {

		// Code for the Validator
		const $validator = $('.card-wizard form').validate({
			rules: {
				firstname: {
					required: true,
					minlength: 3
				},
				lastname: {
					required: true,
					minlength: 3
				},
				email: {
					required: true,
					minlength: 3,
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
					} else if (index > 2) {
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
//Leave the Development version and not the Issue#960 version
				} else if ($valid && titleTemp.trim() == 'Basic') {
					return false;

				} else {
					return true;
				}
			},

			onTabShow: function (tab: any, navigation: any, index: any) {
				let $total = navigation.find('li').length;
				let $current = index + 1;

				const $wizard = navigation.closest('.card-wizard');

				// If it's the last tab then hide the last button and show the finish instead
				if ($current >= $total) {
					$($wizard).find('.btn-next').hide();
					$($wizard).find('.btn-finish').hide();
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
