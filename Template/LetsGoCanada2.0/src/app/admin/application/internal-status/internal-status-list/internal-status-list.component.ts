import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { InternalStatus } from 'src/app/models/internalStatus';
import { GeneralService } from 'src/app/services/general.service';
import { ComunicationService } from 'src/app/services/comunication.service';

@Component({
	selector: 'app-internal-status-list',
	templateUrl: './internal-status-list.component.html',
	styleUrls: ['./internal-status-list.component.css']
})
export class InternalStatusListComponent implements OnInit {

	@Output() internalStatusSelected: EventEmitter<any> = new EventEmitter();
	public internalStatusList: Array<InternalStatus>;
	public pageOfItems;

	constructor(private service: GeneralService, private communication: ComunicationService) {
		this.communication.listenerProcess().subscribe(
			(res: any) => {
				if (res.message == 'Ok') {
					this.fillInternalStatusList();
				}
			}
		)
	}

	ngOnInit() {
		this.internalStatusList = new Array<InternalStatus>();
		this.fillInternalStatusList();
	}

	/**
	 * 
	 * @param pageOfItems 
	 * @author Diego.Perez
	 * @date 04/22/2020
	 */
	onChangePage(pageOfItems) {
		this.pageOfItems = pageOfItems;
	}

	/**
	 * @author Diego.Perez
	 * @date 04/22/2020
	 */
	fillInternalStatusList() {
		let url: string = '/admin/getInternalStatusList';

		this.service.getService(url).subscribe(
			(res) => {
				//console.log(res)
				this.internalStatusList = res.data;
			},
			(err) => {
				console.log(err)
			}
		)
	}

	/**
	 * 
	 * @param status 
	 * @author Diego.Perez
	 * @date 04/22/2020
	 */
	editInternalStatus(status) {
		this.internalStatusSelected.emit(status);
	}

}
