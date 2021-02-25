import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';

declare var $: any;

@Component({
	selector: 'app-recovery-cmp',
	templateUrl: './recovery.component.html',
	styleUrls: ['./recovery.component.css']
})
export class RecoveryComponent implements OnInit, OnDestroy, NotificationsComponent {

	private toggleButton: any;
	private sidebarVisible: boolean;
	private nativeElement: Node;
	public email: string = '';
	public emailValidate: boolean = false;

	constructor(private element: ElementRef, private router: Router, private service: GeneralService) {
		this.nativeElement = element.nativeElement;
		this.sidebarVisible = false;
	}

	ngOnInit() {
		var navbar: HTMLElement = this.element.nativeElement;
		this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];
		const body = document.getElementsByTagName('body')[0];
		body.classList.add('login-page');
		body.classList.add('off-canvas-sidebar');
		const card = document.getElementsByClassName('card')[0];
		setTimeout(function () {
			// after 1000 ms we add the class animated to the login/register card
			card.classList.remove('card-hidden');
		}, 600);
	}

	showNotification(from: any, align: any, type: any, messages: any): void {
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

	sidebarToggle() {
		var toggleButton = this.toggleButton;
		var body = document.getElementsByTagName('body')[0];
		var sidebar = document.getElementsByClassName('navbar-collapse')[0];
		if (this.sidebarVisible == false) {
			setTimeout(function () {
				toggleButton.classList.add('toggled');
			}, 500);
			body.classList.add('nav-open');
			this.sidebarVisible = true;
		} else {
			this.toggleButton.classList.remove('toggled');
			this.sidebarVisible = false;
			body.classList.remove('nav-open');
		}
	}

	ngOnDestroy() {
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('login-page');
		body.classList.remove('off-canvas-sidebar');
	}

	/**
	 * @author Diego.Perez
	 * @date 09/15/2020
	 */
	recovery() {
		console.log('Do the recovery - ', this.email);
		let url: string = '/Email/validateEmail';
		let data = {
			value: this.email
		}
		this.service.noAuthenticationPost(url, data).subscribe(
			(res) => {
				console.log('The answer: ', res);
				if (res.message == 'Ok' && res.data == this.email) {
					this.emailValidate = true;
				}
			},
			(err) => {
				console.log(err);
			}
		)
	}

	/**
	 * @author Diego.Perez.
	 * @date 09/21/2020
	 */
	sendMail() {
		let url: string = '/Email/recoveryPassword';
		let data = {
			value: this.email
		}
		this.service.noAuthenticationPost(url, data).subscribe(
			(res) => {
				//console.log('The final answer: ', res);
				this.showNotification('top', 'right', 'success', res.message);
				this.router.navigate(['login']);
			},
			(err) => {
				console.log(err);
			}
		)
	}

	/**
	 * @author Diego.Perez
	 * @date 09/21/2020
	 */
	isEmailValidated() {
		if (this.emailValidate) {
			return true;
		} else {
			return false;
		}
	}

}
