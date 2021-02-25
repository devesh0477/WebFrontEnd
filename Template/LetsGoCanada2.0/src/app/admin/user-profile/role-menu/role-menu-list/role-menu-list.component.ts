import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { ComunicationService } from 'src/app/services/comunication.service';

@Component({
	selector: 'app-role-menu-list',
	templateUrl: './role-menu-list.component.html',
	styleUrls: ['./role-menu-list.component.css']
})
export class RoleMenuListComponent implements OnInit {

	@Output() roleMenuSelected: EventEmitter<any> = new EventEmitter();
	public roleMenuList;
	public pageOfItems;

	constructor(private service: GeneralService, private communication: ComunicationService) {

		this.communication.listenerProcess().subscribe(
			(res: any) => {
				
				if (res.message == 'Ok') {
					this.fillRolMenuList();
				} else {				
					this.fillRoleMenuSearch(res);
				}
			}
		)
	}

	ngOnInit() {
		this.fillRolMenuList();
	}

	/**
	 * @param rolmenusearch 
	 * @author Diego.Perez
	 * @date 05/06/2020
	 */
	fillRoleMenuSearch(rolmenusearch) {
		let url: string = '/admin/getRoleMenuSearch';

		this.service.post(url, rolmenusearch).subscribe(
			(res) => {
				this.roleMenuList = res.data;
			},
			(err) => {
				console.log(err)
			}
		)
	}

	/**
	 * @author Diego.Perez
	 * @date 04/15/2020
	 */
	fillRolMenuList() {
		let url: string = '/admin/getRoleMenuList';

		this.service.getService(url).subscribe(
			(res) => {
				//console.log(res)
				this.roleMenuList = res.data;
			},
			(err) => {
				console.log(err)
			}
		)
	}

	/**
	 * 
	 * @param pageOfItems 
	 * @author Diego.Perez.
	 * @date 04/20/2020
	 */
	onChangePage(pageOfItems) {
		this.pageOfItems = pageOfItems;
	}

	/**
	 * 
	 * @param item the item that is gonna edited.
	 * @author Diego.Perez.
	 * @date 04/20/2020.
	 */
	editRolMenu(item) {
		//console.log(item)
		this.roleMenuSelected.emit(item);
	}

}
