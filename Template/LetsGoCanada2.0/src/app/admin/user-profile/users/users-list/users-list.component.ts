import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { ComunicationService } from 'src/app/services/comunication.service';
import { LgcUser } from 'src/app/models/lgcUser';

@Component({
	selector: 'app-users-list',
	templateUrl: './users-list.component.html',
	styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit {

	@Output() userSelected: EventEmitter<LgcUser> = new EventEmitter();
	public userList;
	public pageOfItems;

	constructor(private service: GeneralService, private comunication: ComunicationService) {
		this.comunication.listenerProcess().subscribe((m: any) => {
			//console.log('THIS IS M ', m);
			this.fillUsersList();
		});
	}

	ngOnInit() {
		this.userList = [];
		this.fillUsersList();
	}

	/**
	 * @author Diego.Perez.
	 * @date 03/22/2020.
	 */
	fillUsersList() {

		let url: string = '/User/getLGCUserList'; ///Admin/getUsersList';


		this.service.getService(url).subscribe(
			(res) => {
				this.userList = res.data;
			},
			(err) => {
				console.log(err);
			}
		)
	}

	/** 
	 * @param pageOfItems 
	 * @author Diego.Perez
	 * @date 03/22/2020
	 */
	onChangePage(pageOfItems) {
		this.pageOfItems = pageOfItems;
	}

	/**
	 * @param item The user that is gonna be edited.
	 * @author Diego.Perez
	 * @date 04/03/2020
	 */
	editUser(item: LgcUser) {
		this.userSelected.emit(item);
	}

}
