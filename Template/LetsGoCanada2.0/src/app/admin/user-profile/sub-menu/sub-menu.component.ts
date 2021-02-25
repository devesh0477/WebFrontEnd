import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { ComunicationService } from 'src/app/services/comunication.service';
import { showNotification } from 'src/app/toast-message/toast-message';

@Component({
	selector: 'app-sub-menu',
	templateUrl: './sub-menu.component.html',
	styleUrls: ['./sub-menu.component.css']
})
export class SubMenuComponent implements OnInit {

	public submenu = {
		menuId: -1,
		title: '',
		description: '',
		path: '',
		ab: '',
		visible: false
	};
	public btnName = 'Save';
	public menuList;
	public isSearching: boolean = false;

	constructor(private service: GeneralService, private comunication: ComunicationService) { }

	ngOnInit() {
		this.fillMenu();
	}

	/**
	 * @author Diego.Perez.
	 * @date 04/09/2020.
	 */
	fillMenu() {
		let url: string = '/admin/getMenuList';

		this.service.getService(url).subscribe(
			(res) => {
				this.menuList = res.data;
			},
			(err) => {
				console.log(err)
			}
		)
	}

	/**
	 * 
	 * @param $event 
	 * @author Diego.Perez
	 * @date 04/10/2020
	 */
	setSubMenu(subMenu) {

		this.submenu = subMenu;
		this.btnName = 'Update';
	}

	/**
	 * 
	 * @param formu 
	 * @author Diego.Perez
	 * @date 04/10/2020
	 */
	onSubmit(formu) {

		let url: string = '/admin/setSubMenu';
		this.isSearching = true;
		this.service.post(url, this.submenu).subscribe(
			(res) => {
				this.btnName = 'Save';
				formu.resetForm();
				showNotification('top', 'right', 'success', 'The menu was saved successfully.')
				this.submenu = {
					menuId: -1,
					title: '',
					description: '',
					path: '',
					ab: '',
					visible: false
				};

				this.comunication.sendProcess(res);
				this.isSearching = false;
			},
			(err) => {
				console.log(err)
				showNotification('top', 'right', 'danger', 'An error ocurred trying to save the menu.');
				this.isSearching = false;
			}
		)
	}

	/**
	 * @author Diego.Perez
	 * @date 04/14/2020
	 */
	clearForm() {
		console.log("por aca vamos bien");
		this.submenu = {
			menuId: -1,
			title: '',
			description: '',
			path: '',
			ab: '',
			visible: false
		};

		this.btnName = 'Save';
	}

}
