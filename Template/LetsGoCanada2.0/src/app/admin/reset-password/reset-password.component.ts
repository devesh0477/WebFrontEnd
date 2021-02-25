import { Component, OnInit } from '@angular/core';
import { UserPassword } from 'src/app/models/userPassword';
import { GeneralService } from 'src/app/services/general.service';
import { ComunicationService } from 'src/app/services/comunication.service';
import { showNotification } from 'src/app/toast-message/toast-message';
import { ConfigTable } from 'src/app/models/configTable';


@Component({
	selector: 'app-reset-password',
	templateUrl: './reset-password.component.html',
	styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

	public configTable: ConfigTable;
	//  = {
	// 	url: '/User/getUserLoginList',
	// 	headerRow: ['Email', 'Role', 'Active', 'Actions'],
	// 	columnsName: ['email', 'role.name', 'active', 'actions'],
	// 	hasEditAction: true,
	// 	tableTitle: "Users List Table"
	// };

	public user: UserPassword;
	public roleList;
	public btnName: string = 'Reset';

	constructor(private service: GeneralService, private comunication: ComunicationService) { }

	ngOnInit() {
		this.user = new UserPassword();
		this.configTable = new ConfigTable();
		this.configTable.url = '/User/getUserLoginList';
		this.configTable.headerRow = ['Email', 'Role', 'Active', 'Actions'];
		this.configTable.columnsName = ['email', 'role.name', 'active', 'actions'];
		this.configTable.hasEditAction = true;
		this.configTable.tableTitle = "Users List Table";
		this.configTable.request = 'get';
		this.fillRolesList();
	}

	/**
	 * @param $event 
	 * @author Diego.Perez
	 * @date 05/25/2020
	 */
	setObjectSelected(item) {
		this.user.loginId = item.loginId;
		this.user.email = item.email;
		this.user.roleId = item.roleId;
		this.user.active = item.active;
	}

	/**
	 * @author Diego.Perez
	 * @date 05/26/2020
	 */
	fillRolesList() {
		let url: string = '/admin/getRoleList';

		this.service.getService(url).subscribe(
			(res) => {
				this.roleList = res.data;
			},
			(err) => {
				console.log(err)
			}
		)
	}

	/**
	 * @param usersForm 
	 * @author Diego.Perez
	 * @date 05/26/2020
	 */
	onSubmit(usersForm) {
		if (usersForm.valid) {

			let url: string = '/admin/resetPasswordUser';

			this.service.post(url, this.user).subscribe(
				(res) => {
					if (res.message == 'Ok') {
						usersForm.resetForm();
						this.user = new UserPassword();
						showNotification('top', 'right', 'success', 'The user password was reseted successfully.')
						this.comunication.sendProcess(res);

					}
				},
				(err) => {
					console.log(err)
					showNotification('top', 'right', 'danger', 'An error ocurred trying to reset the user password.')
				}
			)
		} else {
			showNotification('top', 'right', 'warning', 'Select a user.')
		}
	}

	/**
	 * @param usersForm 
	 * @author Diego.Perez
	 * @date 05/27/2020
	 */
	clearForm(usersForm) {
		usersForm.resetForm();
		this.user = new UserPassword();
	}

}
