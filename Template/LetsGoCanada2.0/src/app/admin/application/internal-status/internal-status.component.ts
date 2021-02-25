import { Component, OnInit } from '@angular/core';
import { InternalStatus } from 'src/app/models/internalStatus';
import { GeneralService } from 'src/app/services/general.service';
import { showNotification } from 'src/app/toast-message/toast-message';
import { ComunicationService } from 'src/app/services/comunication.service';

@Component({
	selector: 'app-internal-status',
	templateUrl: './internal-status.component.html',
	styleUrls: ['./internal-status.component.css']
})
export class InternalStatusComponent implements OnInit {

	public internalStatus: InternalStatus;
	public btnName: string = 'Save';
	public statusList;
	public isSearching: boolean = false;

	constructor(private service: GeneralService, private communication: ComunicationService) { }

	ngOnInit() {
		this.internalStatus = new InternalStatus();
		this.fillStatusList();
	}

	/**
	 * 
	 * @param item 
	 * @author Diego.Perez
	 * @date 04/22/2020
	 */
	setInternalStatusSelected(item) {

		this.internalStatus.id = item.id;
		this.internalStatus.name = item.name;
		this.internalStatus.description = item.description;
		this.internalStatus.statusId = item.statusId;
		this.btnName = 'Update';
	}

	/**
	 * @author Diego.Perez
	 * @date 04/22/2020
	 */
	fillStatusList() {
		let url: string = '/Application/getStatusList';

		this.service.post(url, null).subscribe(
			(res) => {
				//console.log('Result Status ', res)
				this.statusList = res.data;
			},
			(err) => {
				console.log(err)
			}
		)
	}

	/**
	 * @author Diego.Perez
	 * @date 04/22/2020
	 */
	clearForm(statusmenuForm) {
		this.internalStatus = new InternalStatus();
		this.btnName = 'Save';
		this.isSearching = false;
		statusmenuForm.resetForm();
	}

	/**
	 * @param statusForm 
	 * @author Diego.Perez
	 * @date 04/23/2020
	 */
	onSubmit(statusForm) {

		if (statusForm.valid) {
			let url: string = '/admin/setInternalStatus';
			this.isSearching = true;
			this.service.post(url, this.internalStatus).subscribe(
				(res) => {
					if (res.message == 'Ok') {
						showNotification('top', 'right', 'success', 'The internal status was saved successfully.');
						this.communication.sendProcess(res);
						this.clearForm(statusForm);
						statusForm.resetForm();
					}
					this.isSearching = false;
				},
				(err) => {
					console.log('Error ', err)
					showNotification('top', 'right', 'danger', 'An error ocurred trying to create or update the internal status.');
					this.isSearching = false;
				}
			)
		} else {
			showNotification('top', 'right', 'warning', 'Fill all the required inputs in the form.')
		}
	}
}
