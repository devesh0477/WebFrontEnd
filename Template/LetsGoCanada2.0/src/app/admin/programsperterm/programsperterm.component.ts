import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/services/general.service';
import { TableData } from 'src/app/md/md-table/md-table.component';
import { MatSelectChange } from '@angular/material';
import { getTreeMissingMatchingNodeDefError } from '@angular/cdk/tree';
import { ProgramTerm } from 'src/app/models/programterm';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';
import { Router } from '@angular/router';
import { School } from 'src/app/models/school';
import { isNullOrUndefined } from 'util';

declare const $: any;

@Component({
	selector: 'app-programsperterm',
	templateUrl: './programsperterm.component.html',
	styleUrls: ['./programsperterm.component.css']
})
export class ProgramspertermComponent implements OnInit, NotificationsComponent {

	public buttonName: string = 'Save';
	public termtype: FormGroup;
	public tableData1: TableData;
	public schoolList;
	public programList;
	public termList;
	// public schoolListSelected: number;
	public schoolSelected: number;
	public programListSelected: number[];
	// public termListSelected: number[];
	public termSelected: number;
	public params;
	public programsPerTermList: Array<ProgramTerm>;
	public programTermSelected: ProgramTerm;
	public pageOfItems: Array<ProgramTerm>;
	public campusList;
	public campusSelected: number;
	public whosWorking: string = '';

	constructor(private service: GeneralService, private formBuilder: FormBuilder, private router: Router) {

		if (localStorage.getItem('session') === null || JSON.parse(localStorage.getItem('session')).id == 0) {
			this.router.navigate(['/login']);
		} else {
			this.loadSchools();
			this.loadTerms();
			this.filterTerms();
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
	 * @param pageOfItems
	 * @author Diego.Perez
	 * @date 09/14/2019
	 */
	onChangePage(pageOfItems: Array<ProgramTerm>) {
		this.pageOfItems = pageOfItems
	}

	/**
	 * @param from 
	 * @param align 
	 * @param type 
	 * @param messages 
	 * @author Diego.Perez
	 * @date 09/14/2019
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

	ngOnInit() {

		this.tableData1 = {
			headerRow: ['School', 'Campus', 'Program', 'Term', 'Status', 'Start Date', 'End Date', 'Actions'],
			dataRows: [
				['Dakota Rice', 'Niger', 'Oud-Turnhout', '$36,738']
			]
		};

		this.termtype = this.formBuilder.group({
			// To add a validator, we must first convert the string value into an array. 
			//The first item in the array is the default value if any, then the next item in the array is the validator. 
			//Here we are adding a required validator meaning that the firstName attribute must have a value in it.
			school: [null, Validators.required],
			campus: [null, Validators.required],
			program: [null, Validators.required],
			term: [null, Validators.required],
			coop: [true, Validators.required],
			status: [true, Validators.required],
			startDate: [null, Validators.required],
			endDate: [null, Validators.required],
			submissionDate: [null, Validators.required]
		});

	}

	/**
	 * 
	 * @author Diego.Perez.
	 * @date 09/07/2019
	 */
	loadSchools() {
		let url: string = '/School/getSchoolList';

		let data = {
			"searchString": "",
			"TypeSchool": [],
			"province": [],
			"schoolNames": [],
		}

		this.service.post(url, data).subscribe(
			(res) => {
				this.schoolList = res.data;
			},
			(err) => {
				console.log(err);
			}
		)
	}

	/**
	 * 
	 * @param event 
	 * @author Diego.Perez
	 * @date 09/07/2019
	 */
	selectSchoolChange(event: MatSelectChange) {
		this.schoolSelected = <any>event;
		this.filterTerms();
		this.fillCampusBySchool();

	}

	/**
	 * @author Diego.Perez
	 * @date 06/03/2020
	 */
	fillCampusBySchool() {
		let url: string = '/school/getCampusListingPerSchool/' + this.schoolSelected;

		this.service.getService(url).subscribe(
			(res) => {
				this.campusList = res.data;
			},
			(err) => {
				console.log(err)
			}
		)
	}

	selectCampusChange(event: MatSelectChange) {
		this.campusSelected = <any>event;
		this.fillProgramsBySchools();
	}

	/**
	 * 
	 * @param event 
	 * @author Diego.Perez
	 * @date 09/11/2019
	 */
	selectProgramChange(event: MatSelectChange) {
		this.programListSelected = <any>event;
		this.filterTerms();
	}

	/**
	 * 
	 * @param event 
	 * @author Diego.Perez
	 * @date 09/11/2019
	 */
	selectTermChange(event: MatSelectChange) {
		this.termSelected = <any>event;
		this.filterTerms();
	}

	/**
	 * 
	 * @author Diego.Perez
	 * @date 09/10/2019
	 */
	filterTerms() {
		let url: string = '/school/GetProgramsPerTerm';

		this.params = {
			"schoolID": this.schoolSelected == null ? 0 : this.schoolSelected,
			"campusID": this.campusSelected == null ? 0 : this.campusSelected,
			"ProgramID": this.programListSelected == null ? [] : this.programListSelected,
			"termId": this.termSelected == null ? 0 : this.termSelected
		};

		this.service.post(url, this.params).subscribe(
			(res) => {

				if (res.message == 'Ok') {
					this.programsPerTermList = res.data;
				}
			},
			(err) => {
				console.log(err)
			}
		)
	}

	/**
	 * @author Diego.Perez
	 * @date 09/07/2019
	 */
	fillProgramsBySchools() {
		// let url: string = '/School/getProgramsPerSchool/' + this.schoolSelected;
		let url: string = '/school/getProgramListPerCampus/' + this.campusSelected;
		this.service.getService(url).subscribe(
			(res) => {
				this.programList = res.data;
			},
			(err) => {
				console.log(err);
			}
		)
	}

	/**
	 * 
	 * @author Diego.Perez
	 * @date 09/09/2019
	 */
	loadTerms() {
		let url: string = '/School/getTerms';

		this.service.getService(url).subscribe(
			(res) => {

				if (res.message == 'Ok') {
					this.termList = res.data;
				}
			},
			(err) => {
				console.log(err);
			}
		)
	}

	/**
	 * @author Diego.Perez.
	 * @date 09/11/2019.
	 */
	clearForm() {
		this.termtype.get('school').setValue('');

		this.termtype.get('term').setValue('');	
		this.termtype.get('startDate').setValue('');
		this.termtype.get('endDate').setValue('');
		this.termtype.get('submissionDate').setValue('');

		this.termtype.get('program').setValue('');
		this.termtype.reset();
		this.termtype.get('status').setValue(true);
		this.termtype.get('coop').setValue(true);
		this.buttonName = 'Save';
		this.schoolSelected = null;
		this.programListSelected = null;
		this.termSelected = null;
		this.filterTerms();
	}

	/**
	 * 
	 * @param index 
	 * @author Diego.Perez.
	 * @date 09/11/2019
	 */
	editTerm(school) {

		this.buttonName = 'Update';
		this.programTermSelected = school;
		this.schoolSelected = school.schoolId;
		this.campusSelected = school.campus.campusId;
		this.programTermSelected.termId = school.termId;

		this.fillTerm();
	}

	/**
	 * @author Diego.Perez
	 * @date 09/12/2019
	 */
	fillTerm() {

		var programTemp: Array<number> = new Array<number>();

		programTemp[0] = this.programTermSelected.programId;
		this.schoolSelected = this.programTermSelected.schoolId;
		this.fillCampusBySchool();
		this.fillProgramsBySchools();

		this.termtype.get('school').setValue(this.schoolSelected);
		this.termtype.get('campus').setValue(this.programTermSelected.campusId)
		this.termtype.get('term').setValue(this.programTermSelected.termId);
		this.termtype.get('status').setValue(this.programTermSelected.programStatus);
		this.termtype.get('coop').setValue(this.programTermSelected.isCoopRequired);
		this.termtype.get('startDate').setValue(this.programTermSelected.startDate);
		this.termtype.get('endDate').setValue(this.programTermSelected.endDate);
		this.termtype.get('submissionDate').setValue(this.programTermSelected.submissionDate);

		this.termtype.get('program').setValue(programTemp);
	}

	/**
	 * 
	 * @author Diego.Perez
	 * @date 09/12/2019
	 */
	sendProgramTermBack() {

		let programPerTerm: Array<ProgramTerm> = new Array<ProgramTerm>();

		this.termtype.get('program').value.forEach(program => {

			//if (this.programTermSelected == null) {
			this.programTermSelected = new ProgramTerm();
			//}

			this.programTermSelected.schoolId = this.termtype.get('school').value;
			this.programTermSelected.campusId = this.termtype.get('campus').value;
			this.programTermSelected.termId = this.termtype.get('term').value;
			this.programTermSelected.programStatus = this.termtype.get('status').value;
			this.programTermSelected.isCoopRequired = this.termtype.get('coop').value;
			this.programTermSelected.startDate = this.termtype.get('startDate').value;
			this.programTermSelected.endDate = this.termtype.get('endDate').value;
			this.programTermSelected.submissionDate = this.termtype.get('submissionDate').value;

			this.programTermSelected.programId = program;

			if (isNullOrUndefined(this.programTermSelected.programPerTermId)) {
				this.programTermSelected.programPerTermId = 0;
			}

			programPerTerm.push(this.programTermSelected);

		});

		let url: string = '/School/setProgramPerTerms';

		this.service.post(url, programPerTerm).subscribe(
			(res) => {
				console.log('THE ANSWER IS HERE::::: ', res);
				if (res.message == 'Ok') {
					this.showNotification('top', 'right', 'success', `The program per term was ${this.buttonName.toLowerCase()}d successful.`);
					this.clearForm();
				} else if (res.message.includes('Ok')) {
					this.showNotification('top', 'right', 'warning', `The program per term was ${this.buttonName.toLowerCase()}d successful. ${res.message.toString().replace('Ok.', '')}`);
					this.clearForm();
				}
				this.whosWorking = '';
			},
			(err) => {
				console.log('THE ERROR ANSWER HERE:::::: ', err);

				if (err.error.message)
					this.showNotification('top', 'right', 'danger', err.error.message);
				else
					this.showNotification('top', 'right', 'danger', 'An error ocurred trying to save the program per term.');
				this.whosWorking = '';
			}
		)

	}

	/**
	 * 
	 * @author Diego.Perez
	 * @date 09/12/2019.
	 */
	setTerm(programToSet: ProgramTerm) {

		let url: string = '/School/setProgramPerTerm';
		this.whosWorking = 'submit';
		this.service.post(url, programToSet).subscribe(
			(res) => {
				if (res.message == 'Ok') {
					this.showNotification('top', 'right', 'success', 'The program per term was ' + this.buttonName.toLowerCase() + 'd successful.');
					this.clearForm();
				}
				this.whosWorking = '';
			},
			(err) => {
				if (err.error.message)
					this.showNotification('top', 'right', 'danger', err.error.message);
				else
					this.showNotification('top', 'right', 'danger', 'An error ocurred trying to save the program per term.');
				this.whosWorking = '';
			}
		)

	}

	/**
	 * 
	 * @param term 
	 * @author Diego.Perez
	 * @date 11/04/2019
	 */
	changeStatus(term) {

		let url: string = '/school/toggleProgramPerTerm/' + term.programPerTermId;

		this.service.post(url, null).subscribe(
			(res) => {
				if (res.message == 'Ok') {
					this.showNotification('top', 'right', 'success', 'The program per term status was updated successfully.');
				}
			},
			(err) => {
				console.log(err)
				this.showNotification('top', 'right', 'success', 'The program per term status was not updated.');
			}
		)
	}

}
