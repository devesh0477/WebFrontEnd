import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ComunicationService } from 'src/app/services/comunication.service';
import { GeneralService } from 'src/app/services/general.service';
import { ConfigTable } from 'src/app/models/configTable';
import { ProcessList } from 'src/app/enums/ProcessList';

@Component({
	selector: 'app-basic-table',
	templateUrl: './basic-table.component.html',
	styleUrls: ['./basic-table.component.css'],
})
export class BasicTableComponent implements OnInit {

	@Output() objectSelected: EventEmitter<any> = new EventEmitter();
	@Output() deleteObjectSelected: EventEmitter<any> = new EventEmitter();
	@Input() configTable: ConfigTable;

	public objectList;
	public pageOfItems;
	public showSpinner: boolean;

	constructor(private service: GeneralService, private comunication: ComunicationService) {

		this.comunication.listenerProcess().subscribe(
			(res) => {
				this.preFillList(res);
			}
		)

		if (this.configTable === undefined) {
			this.showSpinner = true;
		}
	}

	ngOnInit() {
		this.fillObjectList();
	}

	/**
	 * @param opt 
	 * @author Diego.Perez
	 * @date 05/05/2020
	 */
	preFillList(opt) {
		if (opt.message == 'Ok') {
			this.showSpinner = true;
			this.fillObjectList();
		} else {
			this.configTable.url = opt.url;
			this.fillObjectList();
		}
	}

	/**
	 * 
	 * @param pageOfItems 
	 * @author Diego.Perez
	 * @date 05/04/2020
	 */
	onChangePage(pageOfItems) {
		this.pageOfItems = pageOfItems;
	}

	/**
	 * @author Diego.Perez
	 * @date 05/04/2020
	 */
	fillObjectList() {

		let url: string = this.configTable.url;
		if (this.configTable.request == null || this.configTable.request == 'get') {

			this.service.getService(url).subscribe(
				(res) => {
					if (res.message == 'Ok') {
						this.showSpinner = false;
						this.objectList = res.data;
					}
				},
				(err) => {
					console.log(err)
				}
			)
		} else if (this.configTable.request == 'post') {
			console.log('THIS COME THROUGH THE POST ON BASIC TABLE COMPONENT');

			if (this.configTable.objRequest) {
				this.service.post(this.configTable.url, this.configTable.objRequest).subscribe(
					res => {
						this.objectList = res.data;
						this.showSpinner = false;
					},
					(err) => {
						console.log(err)
					}
				)
			}
		}
	}

	/**
	 * 
	 * @param item 
	 * @author Diego.Perez
	 * @date 05/04/2020
	 */
	editObject(item) {
		this.objectSelected.emit(item);
	}

	deleteObject(item) {
		this.deleteObjectSelected.emit(item);
	}

	/**
	 * Function to know if the item is type of boolean.
	 * @param item 
	 * @author Diego.Perez
	 * @date 05/21/2020
	 */
	isBoolean(item) {

		if (typeof item === 'boolean') {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * @param processId 
	 * @author Deivid Mafra
	 * @date 11/12/2020
	 */
	getProcessListName = (processId: number): String => {
		return ProcessList[processId];
	}

	/**
	 * @param columnValue 
	 * @author Deivid Mafra
	 * @date 11/12/2020
	 */
	isNumber = (columnValue: string): boolean => {
		return !isNaN(Number(columnValue));
	}
}
