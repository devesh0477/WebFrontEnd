import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { InternalStatusWorkflow } from 'src/app/models/statusWorkflow';
import { ComunicationService } from 'src/app/services/comunication.service';
import { showNotification } from 'src/app/toast-message/toast-message';

declare const $: any;

@Component({
	selector: 'app-internal-status-workflow',
	templateUrl: './internal-status-workflow.component.html',
	styleUrls: ['./internal-status-workflow.component.css']
})
export class InternalStatusWorkflowComponent implements OnInit {

	public btnName: string = 'Save';
	public statusWorkflow: InternalStatusWorkflow;
	public isSearching: boolean = false;
	public internalStatusList;

	constructor(private service: GeneralService, private communication: ComunicationService) { }

	ngOnInit() {
		this.statusWorkflow = new InternalStatusWorkflow();
		this.fillInteranlStatusList();
	}

	/**
	 * 
	 * @param item 
	 * @author Diego.Perez
	 * @date 04/23/2020
	 */
	setIntStatusWorkSelected(item) {

		this.statusWorkflow.id = item.id;
		this.statusWorkflow.currentInternalStatusId = item.currentInternalStatusId;
		this.statusWorkflow.nextInternalStatusId = item.nextInternalStatusId;

		this.btnName = 'Update';
	}

	/**
	 * @author Diego.Perez
	 * @date 04/23/2020
	 */
	fillInteranlStatusList() {
		let url: string = '/admin/getInternalStatusList';

		this.service.getService(url).subscribe(
			(res) => {
				this.internalStatusList = res.data;
			},
			(err) => {
				console.log(err)
			}
		)
	}

	/**
	 * @author Diego.Perez.
	 * @date 04/24/2020
	 */
	clearForm() {
		this.statusWorkflow = new InternalStatusWorkflow();
		this.btnName = 'Save';
		$("mat-form-field").removeClass('mat-form-field-invalid');
		$('mat-select').removeClass('mat-select-invalid');
	}

	/**
	 * @param statusWorkForm 
	 * @author Diego.Perez.
	 */
	onSubmit(statusWorkForm) {
		if (statusWorkForm.valid) {
			let url: string = '/admin/setInternalStatusWorkflow';
			this.isSearching = true;
			this.service.post(url, this.statusWorkflow).subscribe(
				(res) => {
					//console.log(res)
					if (res.message == 'Ok') {
						showNotification('top', 'right', 'success', 'The internal status workflow was saved successfully.');
						this.communication.sendProcess(res);
						statusWorkForm.resetForm();
						this.clearForm();
					}
					this.isSearching = false;
				},
				(err) => {
					console.log(err)
					showNotification('top', 'right', 'danger', 'An error ocurred trying to create or update the internal status workflow.');
					this.isSearching = false;
				}
			)
		} else {
			showNotification('top', 'right', 'warning', 'Select all the required inputs in the form.')
		}
	}

}
