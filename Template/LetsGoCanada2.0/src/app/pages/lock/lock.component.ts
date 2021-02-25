import { Component, OnInit, OnDestroy } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';
import { Router } from '@angular/router';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';

declare var $: any;

@Component({
	selector: 'app-lock-cmp',
	templateUrl: './lock.component.html'
})

export class LockComponent implements OnInit, OnDestroy, NotificationsComponent {

	test: Date = new Date();

	public user = { username: '', password: '' };

	constructor(private service: GeneralService, private router: Router) {
		this.user.username = JSON.parse(localStorage.getItem('session')).username;
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

	/**
	 * 
	 * @param $event 
	 * @author Diego.Perez
	 * @date 09/17/2019
	 */
	unlockSession(event) {
		event.preventDefault();

		let url: string = '/Authorization/authenticate';

		this.service.authentication(url, this.user).subscribe(
			(res) => {
				//console.log(res)
				if (res.message == 'Ok') {
					//let session = res.data;
					localStorage.setItem('session', JSON.stringify(res.data));
					// this.router.navigate(['/dashboard']);
					this.router.navigate(['/home']);
				}
			},
			(err) => {
				// console.log('paila')
				this.showNotification('top', 'right', 'danger', err.error.message);
				//console.log(err)
			}
		)
	}

	ngOnInit() {
		const body = document.getElementsByTagName('body')[0];
		body.classList.add('lock-page');
		body.classList.add('off-canvas-sidebar');
		const card = document.getElementsByClassName('card')[0];
		setTimeout(function () {
			// after 1000 ms we add the class animated to the login/register card
			card.classList.remove('card-hidden');
		}, 700);
	}

	ngOnDestroy() {
		const body = document.getElementsByTagName('body')[0];
		body.classList.remove('lock-page');
		body.classList.remove('off-canvas-sidebar');

	}
}
