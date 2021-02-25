import { Component, OnInit } from '@angular/core';
import { RolMenu } from 'src/app/models/rolMenu';
import { GeneralService } from 'src/app/services/general.service';
import { ComunicationService } from 'src/app/services/comunication.service';

@Component({
	selector: 'app-role-menu-search',
	templateUrl: './role-menu-search.component.html',
	styleUrls: ['./role-menu-search.component.css']
})
export class RoleMenuSearchComponent implements OnInit {

	public rolmenusearch: RolMenu;
	public roleList;
	public subMenuList;
	public isSearching: boolean = false;

	constructor(private service: GeneralService, private comunication: ComunicationService) { }

	ngOnInit() {
		this.rolmenusearch = new RolMenu();
		this.fillRoles();
		this.fillSubMenuList();
	}

	/**
	 * @author Diego.Perez
	 * @date 04/16/2020
	 */
	fillRoles() {

		let url: string = '/admin/getRoleList';

		this.service.getService(url).subscribe(
			(res) => {
				//console.log(res)
				this.roleList = res.data;
			},
			(err) => {
				console.log(err)
			}
		)
	}

	/**
	 * @author Diego.Perez
	 * @date 04/20/2020
	 */
	fillSubMenuList() {
		let url: string = '/admin/GetSubMenuForFill';

		this.service.getService(url).subscribe(
			(res) => {
				//console.log(res)
				this.subMenuList = res.data;
			},
			(err) => {
				console.log(err)
			}
		)
	}

	/**
	 * @param rolmenusearchForm 
	 * @author Diego.Perez
	 * @date 05/06/2020
	 */
	onSubmit(rolmenusearchForm) {
		if (this.rolmenusearch.rolId || this.rolmenusearch.subMenuId)
			this.comunication.sendProcess(this.rolmenusearch);
	}

	/**
	 * @param rolmenusearchForm 
	 * @author Diego.Perez
	 * @date 05/06/2020
	 */
	clearField(rolmenusearchForm) {
		rolmenusearchForm.resetForm();
		this.rolmenusearch = new RolMenu();
		this.comunication.sendProcess(this.rolmenusearch);
	}

}
