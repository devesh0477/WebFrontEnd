import { Component, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators, FormGroup, FormBuilder } from '@angular/forms';
import { ErrorStateMatcher, MatSelectChange } from '@angular/material';
import { TableData } from 'src/app/md/md-table/md-table.component';
import { TableData2 } from 'src/app/tables/extendedtable/extendedtable.component';
import { GeneralService } from 'src/app/services/general.service';
import { HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { GLOBAL } from 'src/app/services/global';
import { ApplicationSearch } from 'src/app/models/applicationSearch';
import { Applicant } from 'src/app/models/applicant';
import { isNullOrUndefined } from 'util';

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
	selector: 'app-applications',
	templateUrl: './applications.component.html',
	styleUrls: ['./applications.component.css']
})
export class ApplicationsComponent implements OnInit {

	public jsonSearch: ApplicationSearch;
	//  = {
	// 	'StatusId': "",
	// 	'SchoolId': 2,
	// 	'ProgramId': 4,
	// 	'ApplicantId': 0,
	// 	'ApplicantName': '',
	// 	'IntakeId': "",
	// 	'Agency': '',
	// 	'Branch': '',
	// 	'Agent': ''
	// };

	public something = {
		"StatusId": [],
		"SchoolId": [2],
		"ProgramId": [4],
		"ApplicantName": "",
		"IntakeId": []
	}

	public schoolList;
	public programList;
	public termLits;
	public statusList;
	public agencyList;
	public branchList;
	public agentList;
	public schoolListSelected: string[];
	public programListSelected: string[];
	public termListSelected: string[];
	public statusListSelected: string[];
	public agencyListSelected: number[];
	public branchListSelected: number[];
	public agentListSelected: number[];
	public session;
	public isAdmin: boolean = false;
	mytest: string = "Deivid Mafra";
	public applicant: Applicant;
	public whosWorking: string = '';

	public applicationSearch: ApplicationSearch;

	emailFormControl = new FormControl('', [
		Validators.required,
		Validators.email,
	]);

	matcher = new MyErrorStateMatcher();

	type: FormGroup;
	constructor(private formBuilder: FormBuilder, private service: GeneralService, private router: Router) {
		this.session = JSON.parse(localStorage.getItem('session'));

		if (GLOBAL.admin.includes(parseInt(this.session.role))) {
			this.isAdmin = true;
		} else {
			this.isAdmin = false;
		}

		if (localStorage.getItem('session') === null || JSON.parse(localStorage.getItem('session')).id == 0) {
			this.router.navigate(['/login']);
		} else {
			this.chargeList();
		}
	}

	/**
	 * Method to define the accion to show the spinner.
	 * @param paramet 
	 * @author Diego.Perez
	 * @date 12/14/2020
	 */
	onPopUpDoing(paramet: string) {
		if (!isNullOrUndefined(paramet) && paramet == this.whosWorking) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * Method charge all list of the page.
	 * 
	 * @author Diego.Perez.
	 * @date 08/06/2019.
	 */
	chargeList() {
		let url: string = '/School/getSchoolNames';

		this.service.getService(url).subscribe(
			(res) => {
				this.schoolList = res.data;
			},
			(err) => {
				console.log(err);
			}
		);

		url = '/School/getTerms';

		this.service.getService(url).subscribe(
			(res) => {
				this.termLits = res.data;
			},
			(err) => {
				console.log(err);
			}
		);

		url = '/Application/getStatusList';

		this.service.post(url, null).subscribe(
			(res) => {
				this.statusList = res.data;
			},
			(err) => {
				console.log(err);
			}
		);

		url = '/agent/getAgencyPerRole';

		this.service.getService(url).subscribe(
			(res) => {
				if (res.message == 'Ok') {
					this.agencyList = res.data;
				}
			},
			(err) => {
				console.log(err)
			}
		);

	}

	/**
	 * 
	 * @param event 
	 * @author Diego.Perez.
	 * @date 08/06/2019.
	 */
	selectSchoolChange(event: MatSelectChange) {
		this.schoolListSelected = <any>event;
		this.fillProgramsBySchools();
	}

	/**
	 * 
	 * @param event 
	 * @author Diego.Perez.
	 * @date 08/06/2019.
	 */
	selectProgramChange(event: MatSelectChange) {
		this.programListSelected = <any>event;
	}

	/**
	 * 
	 * @param event 
	 * @author Diego.Perez.
	 * @date 08/06/2019.
	 */
	selectTermChange(event: MatSelectChange) {
		this.termListSelected = <any>event;
	}

	/**
	 * 
	 * @param event 
	 * @author Diego.Perez.
	 * @date 08/07/2019.
	 */
	selectStatusChange(event: MatSelectChange) {
		this.statusListSelected = <any>event;
	}

	/**
	 * 
	 * @param event 
	 * @author Diego.Perez
	 * @date 10/14/2019
	 */
	selectAgencyChange(event: MatSelectChange) {
		this.agencyListSelected = <any>event;
		this.getBranchList();
	}

	/**
	 * 
	 * @param event 
	 * @author Diego.Perez
	 * @date 10/14/2019
	 */
	selectBranchChange(event: MatSelectChange) {
		this.branchListSelected = <any>event;
		this.getAgentList();
	}

	/**
	 * 
	 * @param event 
	 * @author Diego.Perez
	 * @date 10/14/2019
	 */
	selectAgentChange(event: MatSelectChange) {
		this.agentListSelected = <any>event;
	}

	/**
	 * @author Diego.Perez
	 * @date 10/14/2019
	 */
	getAgentList() {
		let url: string = '/agent/getAgentPerRole';

		let data = {
			'idSet': this.branchListSelected == null ? [] : this.branchListSelected
		}

		this.service.post(url, data).subscribe(
			(res) => {
				if (res.message == 'Ok') {
					this.agentList = res.data;
				}
			},
			(err) => {
				console.log(err)
			}
		)

	}

	/**
	 * 
	 * @author Diego.Perez
	 * @date 10/14/2019
	 */
	getBranchList() {
		let url: string = '/agent/getBranchPerRole';

		let data = {
			'idSet': this.agencyListSelected == null ? [] : this.agencyListSelected
		}

		this.service.post(url, data).subscribe(
			(res) => {
				if (res.message == 'Ok') {
					this.branchList = res.data;
				}
			},
			(err) => {
				console.log(err)
			}
		)
	}

	/**
	 * 
	 * @author Diego.Perez.
	 * @date 08/06/2019.
	 */
	fillProgramsBySchools() {
		let url: string = '/School/getProgramsPerSchool';

		this.service.post(url, this.schoolListSelected).subscribe(
			(res) => {
				this.programList = res.data;
			},
			(err) => {
				console.log(err);
			}
		)
	}


	/**
	 * This method is to search the applications in base on the search parameters.
	 * 
	 * @author Diego.Perez.
	 * @date 08/04/2019.
	 */
	searchApplications() {

		this.applicationSearch = new ApplicationSearch();
		this.applicationSearch.statusId = this.statusListSelected == null ? [] : this.statusListSelected;
		this.applicationSearch.schoolId = this.schoolListSelected == null ? [] : this.schoolListSelected;
		this.applicationSearch.programId = this.programListSelected == null ? [] : this.programListSelected;
		this.applicationSearch.applicationId = this.type.get('applicationId').value;
		this.applicationSearch.applicantName = this.type.get('appliName').value;
		this.applicationSearch.intakeId = this.termListSelected == null ? [] : this.termListSelected;
		this.applicationSearch.agentID = this.agentListSelected == null ? [] : this.agentListSelected;
		this.applicationSearch.branchID = this.branchListSelected == null ? [] : this.branchListSelected;
		this.applicationSearch.agencyID = this.agencyListSelected == null ? [] : this.agencyListSelected;
		this.whosWorking = 'search';

	}

	/**	 
	 * Method that receives the parameter when the callback finish its job to set the property empty again.
	 * @author Diego.Perez
	 * @date 12/21/2020
	 */
	setObjectWorking(e) {
		this.whosWorking = e;
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

	public tableData1: TableData;

	ngOnInit() {
		this.applicant = JSON.parse(localStorage.getItem('session')).selfApplicant;

		this.jsonSearch = new ApplicationSearch();

		this.tableData1 = {
			headerRow: ['Id', 'Name', 'Email', 'Address', 'Passport No.', 'Actions'],
			dataRows: [
				['Andrew Mike', 'Develop', '2013', '99,225', 'btn-link']
			]
		};

		this.type = this.formBuilder.group({
			// To add a validator, we must first convert the string value into an array. The first item in the array is the default value if any, then the next item in the array is the validator. Here we are adding a required validator meaning that the firstName attribute must have a value in it.
			firstName: [null, Validators.required],
			lastName: [null, Validators.required],
			// email: [null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
			status: this.jsonSearch.statusId,
			school: this.jsonSearch.schoolId,
			program: this.jsonSearch.programId,
			term: this.jsonSearch.intakeId,
			agency: this.jsonSearch.agencyID,
			branch: this.jsonSearch.branchID,
			agent: this.jsonSearch.agentID,
			appliName: this.jsonSearch.applicantName,
			applicationId: this.jsonSearch.applicationId
		});
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

	}

}
