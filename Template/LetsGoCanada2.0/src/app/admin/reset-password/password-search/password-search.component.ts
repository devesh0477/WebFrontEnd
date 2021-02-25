import { Component, OnInit, Input } from '@angular/core';
import { UserPassword } from 'src/app/models/userPassword';
import { ComunicationService } from 'src/app/services/comunication.service';
import { ConfigTable } from 'src/app/models/configTable';

@Component({
	selector: 'app-password-search',
	templateUrl: './password-search.component.html',
	styleUrls: ['./password-search.component.css']
})
export class PasswordSearchComponent implements OnInit {

	public userSearch: UserPassword;
	@Input() roleList;

	public configTable: ConfigTable;

	constructor(private comunication: ComunicationService) { }

	ngOnInit() {
		this.userSearch = new UserPassword();
	}

	/**
	 * @param usersSearchForm 
	 * @author Diego.Perez
	 * @date 06/17/2020
	 */
	clearSearchForm(usersSearchForm) {
		usersSearchForm.resetForm();
		this.userSearch = new UserPassword();
		this.configTable = new ConfigTable();
		this.configTable.url = '/User/getUserLoginList';
		this.configTable.headerRow = ['Email', 'Role', 'Active', 'Actions'];
		this.configTable.columnsName = ['email', 'role.name', 'active', 'actions'];
		this.configTable.hasEditAction = true;
		this.configTable.tableTitle = "Users List Table";
		this.configTable.request = 'get';

		this.comunication.sendProcess(this.configTable);
	}

	/**
	 * @param usersSearchForm 
	 * @author Diego.Perez
	 * @date 06/13/2020
	 */
	onSubmit(usersSearchForm) {
		this.configTable = new ConfigTable();
		this.generateUrl();
		this.configTable.headerRow = ['Email', 'Role', 'Active', 'Actions'];
		this.configTable.columnsName = ['email', 'role.name', 'active', 'actions'];
		this.configTable.hasEditAction = true;
		this.configTable.tableTitle = "Users List Table";
		this.configTable.request = 'get';
		this.configTable.objRequest = this.userSearch;

		this.comunication.sendProcess(this.configTable);
		// this.comunication.sendProcess(this.userSearch);
	}

	/**
	 * @author Diego.Perez
	 * @date 06/16/2020
	 */
	generateUrl() {
		
		if (this.userSearch.email != '' && this.userSearch.email != 'undefined') {
			this.configTable.url = '/User/getUserLoginList/?email=' + this.userSearch.email;
		}

		if (this.userSearch.roleId != null && this.userSearch.roleId > 0) {
			if (this.configTable.url.toString().includes('?')) {
				this.configTable.url += '&roleId=' + this.userSearch.roleId;
			} else {
				this.configTable.url += '?roleId=' + this.userSearch.roleId;
			}
		}

	}

}
