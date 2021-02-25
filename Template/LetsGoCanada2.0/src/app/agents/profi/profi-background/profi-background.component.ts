import { Component, OnInit, Input } from '@angular/core';
import { Profile } from 'src/app/models/profile';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { Background } from 'src/app/models/background';
import { ToastmsgService } from 'src/app/services/toastmsg.service';
import { ComunicationService } from 'src/app/services/comunication.service';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-profi-background',
	templateUrl: './profi-background.component.html',
	styleUrls: ['./profi-background.component.css']
})
export class ProfiBackgroundComponent implements OnInit {

	@Input() profile: Profile;

	constructor(private service: GeneralService, private toast: ToastmsgService, private communication: ComunicationService, private route: ActivatedRoute) { }

	profileBackground = new FormGroup({
		appliedVisaCan: new FormControl('', Validators.required),
		prev_Visa_Rejection: new FormControl(''),
		visitedCanUSA: new FormControl(''),
		residingCanUSA: new FormControl(''),
		validCanStayPermit: new FormControl(''),
		validUSAStayPermit: new FormControl(''),
		backComments: new FormControl('', Validators.required),
	});

	ngOnInit() {
		this.profile.background = new Background();
		this.fillBackgroundNull();
		let id: number = parseInt(this.route.snapshot.paramMap.get('id'));
		if (id != null)
			this.loadBackgroundInfo(id);
	}

	/**
	 * @author Diego.Perez
	 * @date 07/04/2020
	 */
	sendBackground() {
		this.fillBackground();
		this.saveBackground();
	}

	/**
	 * Method to get all information from background.
	 */
	fillBackground() {

		if (this.profile.background == null) {
			this.profile.background = new Background();
		}

		if (this.profile.background.applicantId == null) {
			this.profile.background.applicantId = this.profile.applicantId;
		}

		this.profile.background.appliedVisaCan = this.profileBackground.get('appliedVisaCan').value;
		this.profile.background.prevVisaRejection = this.profileBackground.get('prev_Visa_Rejection').value;
		this.profile.background.visitedCanUsa = this.profileBackground.get('visitedCanUSA').value;
		this.profile.background.residingCanUsa = this.profileBackground.get('residingCanUSA').value;
		this.profile.background.validCanStayPermit = this.profileBackground.get('validCanStayPermit').value;
		this.profile.background.validUsastayPermit = this.profileBackground.get('validUSAStayPermit').value;

		if (this.profileBackground.get('appliedVisaCan').value.toString() == 'false' &&
			this.profileBackground.get('prev_Visa_Rejection').value.toString() == 'false' &&
			this.profileBackground.get('visitedCanUSA').value.toString() == 'false' &&
			this.profileBackground.get('residingCanUSA').value.toString() == 'false' &&
			this.profileBackground.get('validCanStayPermit').value.toString() == 'false' &&
			this.profileBackground.get('validUSAStayPermit').value.toString() == 'false') {

			this.profile.background.comments = 'N/A';
			this.profileBackground.get('backComments').setValue('N/A');
		} else {
			this.profile.background.comments = this.profileBackground.get('backComments').value;
		}

	}

	/**
	 * method to save the background information profile
	 */
	saveBackground() {
		let url: string = '/Applicant/setBackgroundInfo';
		this.service.post(url, this.profile.background).subscribe(
			(res) => {
				this.toast.showNotification('top', 'right', 'success', 'The background profile was saved successfully.');
				this.communication.sendProcess(this.profile);
			},
			(err) => {
				this.toast.showNotification('top', 'right', 'warning', 'An error ocurred trying to save the background profile information.');
			}
		)
	}

	/**
	 * Funtion to charge all the information from the database related with background information applicant.
	 * 
	 * @author Diego.Perez.
	 * @date 07/22/2019.
	 */
	loadBackgroundInfo(applicantId: number) {

		let url: string;
		let flag: boolean = false;

		if (!isNaN(applicantId) && applicantId > 0) {
			url = '/Applicant/getBackgroundInfo/' + applicantId;
			flag = true;
		} else if (this.profile != null && !isNaN(this.profile.applicantId)) {
			url = '/Applicant/getBackgroundInfo/' + this.profile.applicantId;
			flag = true;
		}

		if (flag) {
			this.service.getService(url).subscribe(
				(res) => {
					if (res.data.length > 0) {
						this.fillBackgroundVarsLoad(res.data[0]);
					}
				},
				(err) => {
					console.log(err)
				}
			)
		}
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
			this.profileBackground.get('appliedVisaCan').setValue(res['appliedVisaCan'].toString());
			this.profile.background.appliedVisaCan = res['appliedVisaCan'];
		} else {
			this.profileBackground.get('appliedVisaCan').setValue('false');
			this.profile.background.appliedVisaCan = false;
		}

		if (res['prevVisaRejection']) {
			flag = true;
			this.profileBackground.get('prev_Visa_Rejection').setValue(res['prevVisaRejection'].toString());
			this.profile.background.prevVisaRejection = res['prevVisaRejection'];
		} else {
			this.profileBackground.get('prev_Visa_Rejection').setValue('false');
			this.profile.background.prevVisaRejection = false;
		}

		if (res['visitedCanUsa']) {
			flag = true;
			this.profileBackground.get('visitedCanUSA').setValue(res['visitedCanUsa'].toString());
			this.profile.background.visitedCanUsa = res['visitedCanUsa'];
		} else {
			this.profileBackground.get('visitedCanUSA').setValue('false');
			this.profile.background.visitedCanUsa = false;
		}

		if (res['residingCanUsa']) {
			flag = true;
			this.profileBackground.get('residingCanUSA').setValue(res['residingCanUsa'].toString());
			this.profile.background.residingCanUsa = res['residingCanUsa'];
		} else {
			this.profileBackground.get('residingCanUSA').setValue('false');
			this.profile.background.residingCanUsa = false;
		}

		if (res['validCanStayPermit']) {
			flag = true;
			this.profileBackground.get('validCanStayPermit').setValue(res['validCanStayPermit'].toString());
			this.profile.background.validCanStayPermit = res['validCanStayPermit'];
		} else {
			this.profileBackground.get('validCanStayPermit').setValue('false');
			this.profile.background.validCanStayPermit = false;
		}

		if (res['validUsastayPermit']) {
			flag = true;
			this.profileBackground.get('validUSAStayPermit').setValue(res['validUsastayPermit'].toString());
			this.profile.background.validUsastayPermit = res['validUsastayPermit'];
		} else {
			this.profileBackground.get('validUSAStayPermit').setValue('false');
			this.profile.background.validUsastayPermit = false;
		}

		if (flag) {
			this.profileBackground.get('backComments').setValue(res['comments']);
			this.profile.background.comments = res['comments'];
		} else {
			this.profileBackground.get('backComments').setValue('N/A');
			this.profile.background.comments = 'N/A';
		}


		//this.loadDocuments();

	}

	/**
	 * @author Diego.Perez
	 * @date 12/05/2019
	 */
	fillBackgroundNull() {

		this.profileBackground.get('appliedVisaCan').setValue('false');
		this.profileBackground.get('prev_Visa_Rejection').setValue('false');
		this.profileBackground.get('visitedCanUSA').setValue('false');
		this.profileBackground.get('residingCanUSA').setValue('false');
		this.profileBackground.get('validCanStayPermit').setValue('false');
		this.profileBackground.get('validUSAStayPermit').setValue('false');
		this.profileBackground.get('backComments').setValue('N/A');

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
