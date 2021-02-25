import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { ComunicationService } from 'src/app/services/comunication.service';

@Component({
	selector: 'app-sub-menu-list',
	templateUrl: './sub-menu-list.component.html',
	styleUrls: ['./sub-menu-list.component.css']
})
export class SubMenuListComponent implements OnInit {

	@Output() subMenuSelected: EventEmitter<any> = new EventEmitter();
	public subMenuList;
	public pageOfItems;

	constructor(private service: GeneralService, private comunication: ComunicationService) {
		this.comunication.listenerProcess().subscribe((m: any) => {
			this.preFillList(m);
		});
	}

	ngOnInit() {
		this.fillSubMenuList();
	}

	/**
	 * @author Diego.Perez.
	 * @date 04/14/2020
	 */
	preFillList(res) {
		if (res.message == 'Ok') {
			this.fillSubMenuList();
		}
	}

	/**
	 * @author Diego.Perez.
	 * @date 04/05/2020.
	 */
	fillSubMenuList() {
		let url: string = '/admin/getSubMenuList';

		this.service.getService(url).subscribe(
			(res) => {
				this.subMenuList = res.data;
			},
			(err) => {
				console.log(err)
			}
		)
	}

	/**
	 * @param pageOfItems 
	 * @author Diego.Perez.
	 * @date 05/04/2020
	 */
	onChangePage(pageOfItems) {
		this.pageOfItems = pageOfItems;
	}

	/**
	 * 
	 * @param item 
	 * @author Diego.Perez
	 * @date 04/10/2020.
	 */
	editSubMenu(item) {
		this.subMenuSelected.emit(item);
	}

}
