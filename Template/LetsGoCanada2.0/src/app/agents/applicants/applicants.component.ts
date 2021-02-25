import { Component, OnInit } from '@angular/core';
import { TableData } from 'src/app/md/md-table/md-table.component';
import { GeneralService } from 'src/app/services/general.service';
import { Applicant } from 'src/app/models/applicant';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';

declare const $: any;

@Component({
	selector: 'app-applicants',
	templateUrl: './applicants.component.html',
	styleUrls: ['./applicants.component.css']
})
export class ApplicantsComponent implements OnInit, NotificationsComponent {

	public tableData1: TableData;
	public applicantList: Array<Applicant>;
	public pageOfItems: Array<Applicant>;
	searchType: FormGroup;
	public countryList;
	public agencyList;
	public branchList;
	public agentList;
	public countrySelected: number[];
	public agencyListSelected: number[];
	public branchListSelected: number[];
	public agentListSelected: number[];
	public applicant: Applicant;
	public loading: boolean = false;
	public isSearching: boolean = false;


	constructor(private service: GeneralService, private router: Router, private formBuilder: FormBuilder) {
		if (localStorage.getItem('session') === null || JSON.parse(localStorage.getItem('session')).id == 0) {
			this.router.navigate(['/login']);
		} else {
			this.loadApplicants();
			this.fillCountries();
			this.fillAgencyList();
			//this.fillAgentList();
		}
	}

	/**
	 * @author Diego.Perez
	 * @date 10/14/2019
	 */
	fillAgencyList() {
		let url: string = '/agent/getAgencyPerRole';

		this.service.getService(url).subscribe(
			(res) => {
				if (res.message == 'Ok') {
					this.agencyList = res.data;
				}
			},
			(err) => {
				console.log(err)
			}
		)
	}

	/**
	 * @author Diego.Perez
	 * @date 09/30/2019
	 */
	fillAgentList() {
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
	 * @author Diego.Perez
	 * @date 10/14/2019
	 */
	fillBranchList() {
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
				console.log(err);
			}
		)
	}

	/**
	 * @author Diego.Perez
	 * @date 09/30/2019
	 */
	fillCountries() {
		let url: string = '/School/getGeoList';

		this.service.getService(url).subscribe(
			(res) => {

				if (res.message == 'Ok') {
					this.countryList = res.data['country'];
				}
			},
			(err) => {
				console.log(err)
			}
		)
	}

	/**
	 * 
	 * @param event 
	 * @author Diego.Perez
	 * @date 10/14/2019
	 */
	selectAgencyChange(event: MatSelectChange) {
		this.agencyListSelected = <any>event;
		this.fillBranchList();
	}

	/**
	 * 
	 * @param event 
	 * @author Diego.Perez
	 * @date 10/14/2019
	 */
	selectBranchChange(event: MatSelectChange) {
		this.branchListSelected = <any>event;
		this.fillAgentList();
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
	 * 
	 * @param pageOfItems 
	 * @author Deivid.Mafra
	 * @date 09/13/2019
	 */
	onChangePage(pageOfItems: Array<Applicant>) {
		this.pageOfItems = pageOfItems
	}

	/**
	 * Method to load all applicants that the agent have relate its.
	 * 
	 * @author Diego.Perez.
	 * @date 07/25/2019
	 */
	loadApplicants() {
		let url: string = '/Applicant/getApplicantList';
		this.service.getService(url).subscribe(
			(res) => {
				this.applicantList = new Array<Applicant>();
				this.applicantList = res.data;
				//console.log(res.data[0])
			},
			(err) => {
				console.log(err);
			}
		)
	}

	/**
	 * Method to allow the user to edit or select an applicant from the table.
	 * 
	 * @param applicantId 
	 * @author Diego.Perez.
	 * @date 07/25/2019.
	 */
	editApplicant(applicantId) {
		//this.router.navigate(['profile/' + applicantId]);
		this.router.navigate(['profi/' + applicantId]);
	}

	/**
	 * 
	 * @param event 
	 * @author Diego.Perez
	 * @date 09/30/2019
	 */
	onCountryChange(event: MatSelectChange) {
		this.countrySelected = <any>event;
	}

	/**
	 * 
	 * @author Diego.Perez
	 * @date 09/30/2019
	 */
	searchApplicant() {

		let url: string = '/Applicant/getApplicantListfiltered';

		let search = {
			"searchString": this.searchType.get('search').value,
			"applicantId": this.searchType.get('applicantId').value == null ? 0 : this.searchType.get('applicantId').value,
			"city": this.searchType.get('city').value == null ? [] : [this.searchType.get('city').value],
			"Province": this.searchType.get('province').value == null ? [] : [this.searchType.get('province').value],
			"countryID": this.countrySelected == null ? [] : this.countrySelected,
			"AgentID": this.agentListSelected == null ? [] : this.agentListSelected,
			"BranchID": this.branchListSelected == null ? [] : this.branchListSelected,
			"AgencyID": this.agencyListSelected == null ? [] : this.agencyListSelected,
			"ProfileComplete": []
		}

		this.isSearching = true;
		this.service.post(url, search).subscribe(
			(res) => {
				if (res.message == 'Ok') {
					this.applicantList = res.data;
					this.clearForm();
				}
				this.isSearching = false;
			},
			(err) => {
				this.isSearching = false;
				console.log(err)
			}
		)
	}

	/**
	 * 
	 * @param applicant Object that containts the applicant selected.
	 * @author Diego.Perez.
	 * @date 02/09/2020
	 */
	downloadDocument(applicant) {

		let url: string = '/Applicant/getApplicantDocuments/' + applicant.applicantId;
		this.loading = true;
		this.service.downloadFile(url, applicant.applicantId).subscribe(
			(res) => {
				this.downLoadFile(res.body, res.body.type);
				this.loading = false;
			},
			(err) => {
				this.showNotification('top', 'right', 'danger', 'An error occurred trying to download the document.');
				console.log(err);
				this.loading = false;
			}

		);
	}

	/**
	 * 
	 * @param applicant the applicant object selected
	 * @author Diego.Perez.
	 * @date 03/18/2020
	 */
	downloadAttachments(applicant) {
		let url: string = '/Applicant/getApplicantDocuments_Full/' + applicant.applicantId;
		this.loading = true;
		this.service.downloadFile(url, applicant.applicantId).subscribe(
			(res) => {
				this.downLoadFile(res.body, res.body.type);
				this.loading = false;
			},
			(err) => {
				this.showNotification('top', 'right', 'danger', 'An error occurred trying to download the attachment documents.');
				console.log(err)
				this.loading = false;
			}
		);
	}

	/**
	 * Method to download a file.
	 * 
	 * @param data 
	 * @param type 
	 * @author Diego.Perez.
	 * @date 02/09/2020
	 */
	downLoadFile(data: any, type: string) {
		let blob = new Blob([data], { type: type });
		let url = window.URL.createObjectURL(blob);
		let pwa = window.open(url);

		if (!pwa || pwa.closed || typeof pwa.closed == 'undefined') {
			// console.log('Please disable your Pop-up blocker and try again.');
			this.showNotification('top', 'right', 'success', 'Please disable your Pop-up blocker and try again.');
		}
	}

	/**
	 * @author Diego.Perez
	 * @date 09/30/2019
	 */
	clearForm() {
		this.searchType.reset();
	}

	ngOnInit() {
		this.applicant = JSON.parse(localStorage.getItem('session')).selfApplicant;

		this.tableData1 = {
			headerRow: ['Name', 'Email', 'Phone', 'City', 'Complete', 'Actions'],
			dataRows: [
				['Dakota Rice', 'Niger', 'Oud-Turnhout', '$36,738']
			]
		};

		this.searchType = this.formBuilder.group({
			// To add a validator, we must first convert the string value into an array. 
			//The first item in the array is the default value if any, then the next item in the array is the validator. 
			//Here we are adding a required validator meaning that the firstName attribute must have a value in it.
			search: [null, Validators.required],
			applicantId: [null, Validators.required],
			city: [null, Validators.required],
			province: [null, Validators.required],
			country: [null, Validators.required],
			agency: [null, Validators.required],
			branch: [null, Validators.required],
			agent: [null, Validators.required]
		});
	}

	/**
	 * 
	 * @author Diego.Perez
	 * @date 02/09/2019 
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

	/**
	 * @author Diego.Perez
	 * @date 12/21/2020
	 */
	createNewApplicant() {
		this.router.navigateByUrl('/profi');
	}

}
