import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { LgcUser } from 'src/app/models/lgcUser';
import { LgcPersonal } from 'src/app/models/lgcPersonal';
import { ComunicationService } from 'src/app/services/comunication.service';
import { showNotification } from 'src/app/toast-message/toast-message';

@Component({
	selector: 'app-users',
	templateUrl: './users.component.html',
	styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

	public roleList;
	public user: LgcUser;
	public countries;

	public btnName: string = 'Save';

	constructor(private service: GeneralService, private communication: ComunicationService) { }

	ngOnInit() {
		this.user = new LgcUser();
		this.user.lgcpersonal = new LgcPersonal();

		this.fillRoleList();
		this.fillCountryList();
	}

	/**
	 * 
	 * @param formu 
	 */
	onSubmit(formu) {
		if (!formu.valid) {
			showNotification('top', 'right', 'warning', 'Fill the required inputs in the form.')
		} else {
			console.log(this.user)
			let url: string = '/User/setLGCUser';
			this.service.post(url, this.user).subscribe(
				(res) => {
					console.log(res)
					if (res.message == 'Ok') {
						this.communication.sendProcess(res);
						this.user = new LgcUser();
						this.user.lgcpersonal = new LgcPersonal();
						showNotification('top', 'right', 'success', 'The user was saved successfully.')
						this.btnName = 'Save';
						formu.resetForm();
						setTimeout(() => {
							this.user = new LgcUser();
							this.user.lgcpersonal = new LgcPersonal();
						}, 1000);

					}
				},
				(err) => {
					console.log(err);
					showNotification('top', 'right', 'danger', 'An error ocurred trying to save the user.')
				}
			)
		}
	}

	/**
	 * @author Diego.Perez.
	 * @date 03/23/2020
	 */
	fillRoleList() {
		let url: string = '/Admin/getRoleList';

		this.service.getService(url).subscribe(
			(res) => {
				this.roleList = res.data;
			},
			(err) => {
				console.log(err);
			}
		)
	}

	/**
	 * @author Diego.Perez
	 * @date 04/03/2020.
	 */
	fillCountryList() {
		let url: string = '/admin/getCountryList';

		this.service.getService(url).subscribe(
			(res) => {
				this.countries = res.data;
			},
			(err) => {
				console.log(err)
			}
		);
	}

	/**
	 * @param userSelec the user that was selected for update.
	 * @author Diego.Perez.
	 * @date 04/03/2020.
	 */
	setUser(userSelec) {

		//console.log('SIKAS LLEGO ', userSelec)
		let url: string = '/User/getLGCUserperID/' + userSelec.loginId;
		//console.log(url)

		this.service.getService(url).subscribe(
			(res) => {
				console.log('Resultado: ', res.data[0])
				this.user = res.data[0];
				this.btnName = 'Update';
			},
			(err) => {
				console.log(err)
			}
		);



	}

}
