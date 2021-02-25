import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { TableData } from 'src/app/md/md-table/md-table.component';
import { ApplicationSearch } from 'src/app/models/applicationSearch';
import { GeneralService } from 'src/app/services/general.service';
import { Router } from '@angular/router';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';
import { ComunicationService } from 'src/app/services/comunication.service';

declare const $: any;

@Component({
	selector: 'app-applications-result',
	templateUrl: './applications-result.component.html',
	styleUrls: ['./applications-result.component.css']
})
export class ApplicationsResultComponent implements OnInit, NotificationsComponent {

	// @ViewChild('searchModal') searchInput;
	@Input() applicationToSearch;
	@Output() working: EventEmitter<string> = new EventEmitter();
	public tableData1: TableData;

	applicationSearch: ApplicationSearch;
	public applications;
	public pageOfItems;

	constructor(private service: GeneralService, private router: Router, private comunication: ComunicationService) { }

	ngOnInit() {

		this.tableData1 = {
			headerRow: ['ID', 'Name', 'Email', 'Program', 'School', 'Agent', 'Status', 'Actions'],
			dataRows: [
				['Andrew Mike', 'Develop', '2013', '99,225', 'btn-link']
			]
		};

		this.searchApplications();
	}

	/**
	 * 
	 * @param pageOfItems 
	 * @author Diego.Perez
	 * @date 09/14/2019
	 */
	onChangePage(pageOfItems) {
		this.pageOfItems = pageOfItems;
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
	 * 
	 * @param changes 
	 * @author Diego.Perez
	 * @date 02/08/2020
	 */
	ngOnChanges(changes: SimpleChanges): void {
		//Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
		//Add '${implements OnChanges}' to the class.
		this.searchApplications();
	}

	/**
	 * @author Diego.Perez
	 * @date 02/07/2020
	 */
	searchApplications() {

		if (!this.applicationToSearch) {

			this.applicationToSearch = new ApplicationSearch();
			this.applicationToSearch.statusId = [];
			this.applicationToSearch.schoolId = [];
			this.applicationToSearch.programId = [];
			this.applicationToSearch.applicationId = 0
			this.applicationToSearch.applicantName = "";
			this.applicationToSearch.intakeId = [];
			this.applicationToSearch.agentID = [];
			this.applicationToSearch.branchID = [];
			this.applicationToSearch.agencyID = [];
		}

		if (this.applicationToSearch != null) {

			let url: string = '/Application/getApplicationListFiltered';
			
			this.service.post(url, this.applicationToSearch).subscribe(
				(res) => {
					if (res.message == 'Ok' && res.data.length > 0) {
						this.applications = res.data;
						this.working.emit('');
					}
				},
				(err) => {
					this.showNotification('top', 'right', 'danger', 'An error occurred trying to get the applications.');
					console.log(err)
					this.working.emit('');
				}			
			)
		}
	}

	/**
	 * 
	 * @param index 
	 * @author Diego.Perez
	 * @date 08/07/2019.
	 */
	aplicationDetails(index) {
		this.router.navigate(['application-details/' + index.id]);
	}

}
