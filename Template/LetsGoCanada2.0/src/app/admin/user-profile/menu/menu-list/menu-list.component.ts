import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { Menu } from 'src/app/models/menu';
import { Observable } from 'rxjs';
import { ComunicationService } from 'src/app/services/comunication.service';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';

declare const $: any;

@Component({
	selector: 'app-menu-list',
	templateUrl: './menu-list.component.html',
	styleUrls: ['./menu-list.component.css']
})
export class MenuListComponent implements OnInit, NotificationsComponent {

	// @Input() menuToSave: Menu;
	@Output() menuSeleccionado:EventEmitter<Menu> = new EventEmitter();
	public menu: Menu;
	public menuList: Array<Menu>;
	public pageOfItems;

	constructor(private service: GeneralService, private comuniService: ComunicationService) {
		this.getMenuList();
		this.comuniService.listenerProcess().subscribe((m: any) => {
			this.saveMenu(m);
		});
	}

	ngOnInit() { }

	/**
	 *  Notification implementations.
	 */
	showNotification(from: any, align: any, type?: any, messages?: any): void {
		$.notify({
			icon: 'notifications',
			message: messages //'Welcome to <b>Material Dashboard</b> - a beautiful dashboard for every web developer.'
		}, {
			type: type,//[color],
			timer: 3000,
			placement: {
				from: from,
				align: align
			},
			template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0} alert-with-icon" role="alert">' +
				'<button mat-raised-button type="button" aria-hidden="true" class="close" data-notify="dismiss">  <i class="material-icons">close</i></button>' +
				'<i class="material-icons" data-notify="icon">notifications</i> ' +
				'<span data-notify="title">{1}</span> ' +
				'<span data-notify="message">{2}</span>' +
				'<div class="progress" data-notify="progressbar">' +
				'<div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
				'</div>' +
				'<a href="{3}" target="{4}" data-notify="url"></a>' +
				'</div>'
		});
	}

	/**
	 * @author Diego.Perez.
	 * @date 02/13/2020.
	 */
	saveMenu(req: any) {
		
		if (req.message == 'Ok') {
			//this.menuList.push(req.data[0]);
			this.getMenuList();
			this.showNotification('top', 'right', 'success', 'The menu was saved correctly.');
			
		} else {
			this.showNotification('top', 'right', 'danger', 'An error ocurred trying to save the menu.');
		}

	}

	/**
	 * Method to send the menu object to the parent.
	 * 
	 * @param men Object reference to edit.
	 * @author Diego.Perez.
	 * @date 02/18/2020.
	 */
	editMenu(men: Menu) {
		
		this.menuSeleccionado.emit(men);
	}

	/**
	 * @author Diego.Perez.
	 * @date 02/13/2020.
	 */
	public getMenuList() {

		let url: string = '/Admin/getMenuList';

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
	 * @param pageOfItems 
	 * @author Diego.Perez
	 * @date 09/14/2019
	 */
	onChangePage(pageOfItems) {
		this.pageOfItems = pageOfItems;
	}

}