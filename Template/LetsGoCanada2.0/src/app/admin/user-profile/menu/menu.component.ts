import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, FormGroupDirective, NgForm } from '@angular/forms';
import { validateConfig } from '@angular/router/src/config';
import { Menu } from 'src/app/models/menu';
import { GeneralService } from 'src/app/services/general.service';
import { ComunicationService } from 'src/app/services/comunication.service';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';
import { ErrorStateMatcher } from '@angular/material';

declare const $: any;

export class MyErrorStateMatcher implements ErrorStateMatcher {
	isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
		const isSubmitted = form && form.submitted;
		return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
	}
}

@Component({
	selector: 'app-menu',
	templateUrl: './menu.component.html',
	styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, NotificationsComponent {

	public menu: Menu;
	public iconList;
	public btnName: string = 'Save';
	public isSearching: boolean = false;

	constructor(private formBuilder: FormBuilder, private service: GeneralService, private comuniService: ComunicationService) {
		this.getIconList();
	}

	ngOnInit() {
		this.menu = new Menu();
	}

	/**
	 * 
	 * @param menuForm 
	 */
	onSubmit(menuForm) {
		//console.log(menuForm)
		if (!menuForm.valid) {
			this.showNotification('top', 'right', 'danger', 'Please fill out the form correctly.');
		} else {
			this.saveMenu();
			menuForm.resetForm();
		}
	}

	/**
	 * @author Diego.Perez.
	 * @date 02/13/2020.
	 */
	saveMenu() {

		let url: string = '/Admin/setMenu';

		if (this.menu) {
			this.isSearching = true;
			this.service.post(url, this.menu).subscribe(
				(res) => {

					if (res.message == 'Ok') {
						this.comuniService.sendProcess(res);
						this.menu = new Menu();
						this.btnName = 'Save';
					}
					this.isSearching = false;
				},
				(err) => {
					console.log(err);
					this.showNotification('top', 'right', 'danger', 'An error ocurred trying to save the menu.');
					this.isSearching = false;
				}
			);
		}
	}

	/**
	 * @param menuForm 
	 * @author Diego.Perez
	 * @date 05/05/2020
	 */
	clearForm(menuForm) {
		menuForm.resetForm();
		this.btnName = 'Save';
		this.menu = new Menu();
	}

	/**
	 * 
	 * @param obj 
	 * @author Diego.Perez.
	 * @date 02/18/2020
	 */
	setMenu(obj) {

		this.menu.menuId = obj.menuId;
		this.menu.title = obj.title;
		this.menu.description = obj.description;
		this.menu.path = obj.path;
		this.menu.type = obj.type;
		this.menu.collapse = obj.collapse;
		this.menu.iconType = obj.icontype;
		this.btnName = 'Update';

	}

	/**
	 * @author Diego.Perez.
	 * @date 02/02/2020
	 */
	getIconList() {
		let url: string = '/Admin/getIconList';

		this.service.getService(url).subscribe(
			(res) => {
				this.iconList = res;
			},
			(err) => {
				console.log(err)
			}
		)
	}

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

}
