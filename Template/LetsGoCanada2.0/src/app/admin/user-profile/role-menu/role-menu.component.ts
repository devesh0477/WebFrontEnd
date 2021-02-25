import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { ComunicationService } from 'src/app/services/comunication.service';
import { RolMenu } from 'src/app/models/rolMenu';
import { showNotification } from 'src/app/toast-message/toast-message';

@Component({
	selector: 'app-role-menu',
	templateUrl: './role-menu.component.html',
	styleUrls: ['./role-menu.component.css']
})
export class RoleMenuComponent implements OnInit {

	public btnName: string = 'Save';
	public rolmenu: RolMenu;
	public roleList;
	public subMenuList;
	public btnVisible = false;
	public isSearching: boolean = false;

	constructor(private service: GeneralService, private comunication: ComunicationService) { }

	ngOnInit() {
		this.rolmenu = new RolMenu();
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
	 * 
	 * @param item 
	 * @author Diego.Perez
	 * @date 04/20/2020
	 */
	setRoleMenu(item) {
		this.rolmenu = item;
		this.btnName = 'Update';
		this.btnVisible = true;
	}

	/**
	 * 
	 * @param rolForm 
	 * @author Diego.Perez
	 * @date 04/20/2020
	 */
	onSubmit(rolForm) {

		if (rolForm.valid) {

			let url: string = '/admin/setRoleMenu';

			let data = {
				Id: this.rolmenu.id,
				RolId: this.rolmenu.rolId,
				SubMenuId: this.rolmenu.subMenuId
			}
			this.isSearching = true;
			this.service.post(url, data).subscribe(
				(res) => {
					if (res.message == 'Ok') {
						this.comunication.sendProcess(res);
						showNotification('top', 'right', 'success', 'The role menu was saved successfully.')
						this.clearForm();
						rolForm.resetForm();
					}
					this.isSearching = false;
				},
				(err) => {
					console.log('ERROR ', err.error.message)
					showNotification('top', 'right', 'danger', 'An error ocurred trying to create or update the role menu.');
					this.isSearching = false;
				}
			)

		} else {
			showNotification('top', 'right', 'warning', 'Select the required inputs in the form.')
		}
	}

	/**
	 * @author Diego.Perez
	 * @date 04/20/2020
	 */
	clearForm() {
		this.rolmenu = new RolMenu();
		this.btnName = 'Save';
		this.btnVisible = false;
	}

	/**
	 * @author Diego.Perez
	 * @date 04/22/2020
	 */
	deleteRolMenu() {
		let url: string = '/admin/deleteOneRoleMenu';

		this.service.post(url, this.rolmenu).subscribe(
			(res) => {
				this.comunication.sendProcess(res);
				showNotification('top', 'right', 'success', 'The role menu was deleted successfully.')
				this.clearForm();
			},
			(err) => {
				console.log(err)
			}
		)
	}

}
