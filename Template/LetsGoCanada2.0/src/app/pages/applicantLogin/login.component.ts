import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
//import { userInfo } from 'os';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';

declare var $: any;

@Component({
    selector: 'app-applicant-login-cmp',
    templateUrl: './login.component.html'
})

export class ApplicantLoginComponent implements OnInit, OnDestroy, NotificationsComponent {
    test: Date = new Date();
    private toggleButton: any;
    private sidebarVisible: boolean;
    private nativeElement: Node;
    public user = { username: '', password: '' };
    public autorization = {
        'Username': '',
        'password': ''
    };

    public session = {
        "id": 0,
        "username": '',
        "password": '',
        "role": '',
        "token": ''
    }

    public respuesta: string;

    constructor(private element: ElementRef, private router: Router, private service: GeneralService) {
        // console.log('--------')
        // console.log(localStorage.getItem('session'))
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

    login() {
        let url: string = '/Authorization/authenticate';
        this.autorization.Username = this.user.username;
        this.autorization.password = this.user.password;

        if (this.user.username != '' && this.user.password != '') {
            this.service.authentication(url, this.autorization).subscribe(
                (res) => {
                    if (res.message == 'Ok') {
                        this.session = res.data;
                        localStorage.setItem('session', JSON.stringify(res.data));
                        this.router.navigate(['/home']);
                    }
                },
                (err) => {
                    this.showNotification('top', 'right', 'danger', err.error.message);
                }
            );

        }
    }
}
