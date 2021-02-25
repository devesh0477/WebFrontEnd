import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { ComunicationService } from 'src/app/services/comunication.service';

@Component({
	selector: 'app-int-status-workflow-list',
	templateUrl: './int-status-workflow-list.component.html',
	styleUrls: ['./int-status-workflow-list.component.css']
})
export class IntStatusWorkflowListComponent implements OnInit {

	@Output() intStatusWorkSelected: EventEmitter<any> = new EventEmitter();

	public interalWorkflowList;
	public pageOfItems;

	constructor(private service: GeneralService, private communication: ComunicationService) {
		this.communication.listenerProcess().subscribe(
			(res: any) => {
				if (res.message == 'Ok') {
					this.fillInteranlStaWorkFlow();
				}
			});
	}

	ngOnInit() {
		this.fillInteranlStaWorkFlow();
	}

	fillInteranlStaWorkFlow() {
		let url: string = '/admin/getInternalStatusWorkflowList';

		this.service.getService(url).subscribe(
			(res) => {				
				this.interalWorkflowList = res.data;
			},
			(err) => {
				console.log(err)
			}
		)
	}

	/**
	 * 
	 * @param pageOfItems 
	 * @author Diego.Perez
	 * @date 04/23/2020
	 */
	onChangePage(pageOfItems) {
		this.pageOfItems = pageOfItems;
	}

	/**
	 * 
	 * @param item 
	 * @author Diego.Perez
	 * @date 04/23/2020.
	 */
	editInternalStatus(item) {
		this.intStatusWorkSelected.emit(item);
	}

}
