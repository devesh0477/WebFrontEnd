import { Component, OnInit, ElementRef, OnDestroy } from '@angular/core';
import { School } from 'src/app/models/school';
import { SchoolMedia } from 'src/app/models/schoolMedia';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/services/general.service';
import { NotificationsComponent } from 'src/app/components/notifications/notifications.component';
import { LoginService } from 'src/app/services/login.service';

declare var $: any;

@Component({
    selector: 'app-login-cmp',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})

export class LoginComponent implements OnInit, OnDestroy, NotificationsComponent {
    private toggleButton: any;
    private sidebarVisible: boolean;
    public partnersLoaded: boolean = false;
    private nativeElement: Node;
    public user = { username: '', password: '' };
    public schools: Array<School>;
    public autorization = {
        'Username': '',
        'password': '',
        'Country': ''
    };

    public session = {
        "id": 0,
        "username": '',
        "password": '',
        "role": '',
        "token": ''
    }

    public respuesta: string;

    constructor(private element: ElementRef, private router: Router, private service: GeneralService, private loginService: LoginService) {
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
        this.getSchools();
    }

    getSchools() {
        let url: string = '/School/GetAcademicPartnersSchoolList';
        // http://localhost:44349/api/School/GetAcademicPartnersSchoolList
        let data = {
        }

        this.service.postWithoutAuth(url, data).subscribe(
            (res) => {
                if (!res.data[0]) {
                    this.showNotification('top', 'right', 'danger', 'There is no schools for this selection!');
                    this.schools = [];
                } else {
                    this.schools = res.data;
                    this.schools[0].logos = new SchoolMedia();
                    for (let i = 0; i < this.schools.length; i++) {
                        this.schools[i].logos = new SchoolMedia();
                        this.schools[i].logos.mediaLocation = "./assets/img/image_placeholder.jpg";
                        for (let k = 0; k < this.schools[i].schoolMedia.length; k++) {
                            if (this.schools[i].schoolMedia[k].mediaTypeId == 1) {
                                this.schools[i].logos.mediaLocation = this.schools[i].schoolMedia[k].mediaLocation;
                            }
                        }
                    }
                }
            },
            (err) => {
                console.log(err);
            })
    }

    alignVImages(){
        var bbodyPage : HTMLElement = this.element.nativeElement;
        var lstElement  = bbodyPage.getElementsByClassName('carouselImgTarget');
        for ( var i = 0; i < lstElement.length; i++){
            var targetElement = ((lstElement[i]) as HTMLImageElement);
            if(targetElement.height < 40){
                targetElement.classList.add("carouselImgVAligned");
            }
        }

        this.partnersLoaded = true;
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

        setTimeout( function () {
            this.alignVImages();
        }.bind(this), 500);
    }

    doRecovery(e) {
        e.preventDefault();
        //console.log('Do something!!')
        this.router.navigate(['recovery']);
    }

    /**
     * @param from 
     * @param align 
     * @param type1 
     * @param messages
     * @date 08/16/2019. 
     */
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
     * Method to do login and validations.
     * 
     * @author Diego.Perez.
     * @date 06/05/2019.
     * @modification 09/12/2019.
     */
    login() {

        this.loginService.login(this.user.username, this.user.password);

    }
}