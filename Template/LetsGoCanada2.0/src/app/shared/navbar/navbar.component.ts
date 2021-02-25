import { Component, OnInit, Renderer, ViewChild, ElementRef, Directive, Inject, LOCALE_ID } from '@angular/core';
import { ROUTES } from '../.././sidebar/sidebar.component';
import { Router, ActivatedRoute, NavigationEnd, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { GeneralService } from 'src/app/services/general.service';
const misc: any = {
    navbar_menu_visible: 0,
    active_collapse: true,
    disabled_collapse_init: 0,
};

declare var $: any;
@Component({
    selector: 'app-navbar-cmp',
    templateUrl: 'navbar.component.html',
    styleUrls: ['./navbar.component.css']
})

export class NavbarComponent implements OnInit {
    private listTitles: any[];
    location: Location;
    mobile_menu_visible: any = 0;
    private nativeElement: Node;
    private toggleButton: any;
    private sidebarVisible: boolean;
    private _router: Subscription;
    public sessionUser: string;
    public session;
    // private user: string[];
    public user = new Array(
        {
            'companyName': '',
            'description': '',
            "firstName": '',
            'lastName': '',
            'phonNumber': '',
            'role': '',
            'userName': ''
        }
    );

    @ViewChild('app-navbar-cmp') button: any;
    languageList =
        [
            { code: 'en', label: 'English' },
            { code: 'pt', label: 'Português' },
            { code: 'fr', label: 'Français' },
            { code: 'es', label: 'Spanish' }
        ];

    // public currentRoute: string;
    // public flags: boolean = false;

    constructor(
        location: Location,
        private renderer: Renderer,
        private element: ElementRef,
        private router: Router,
        private service: GeneralService,
        @Inject(LOCALE_ID) protected localeId: string
    ) {
        this.location = location;
        this.nativeElement = element.nativeElement;
        this.sidebarVisible = false;
        // this.currentRoute = this.router.url;
        // console.log("this.router.url", this.router.url)
    }

    /**
     * Method to do the sign out session.
     * 
     * @param event 
     * @author Diego.Perez
     * @date 09/17/2019
     */
    signOut(event) {
        event.preventDefault();
        localStorage.clear();
        this.router.navigate(['/login']);
    }

    /**
     * 
     * @param $event 
     * @author Diego.Perez
     * @date 09/17/2019
     */
    lockSession(event) {
        event.preventDefault();
        let session = JSON.parse(localStorage.getItem('session'));
        session.token = '';
        session.id = 0;
        localStorage.setItem('session', JSON.stringify(session));
        this.router.navigate(['/lock']);
    }

    minimizeSidebar() {
        const body = document.getElementsByTagName('body')[0];

        if (misc.sidebar_mini_active === true) {
            body.classList.remove('sidebar-mini');
            misc.sidebar_mini_active = false;

        } else {
            setTimeout(function () {
                body.classList.add('sidebar-mini');

                misc.sidebar_mini_active = true;
            }, 300);
        }

        // we simulate the window Resize so the charts will get updated in realtime.
        const simulateWindowResize = setInterval(function () {
            window.dispatchEvent(new Event('resize'));
        }, 180);

        // we stop the simulation of Window Resize after the animations are completed
        setTimeout(function () {
            clearInterval(simulateWindowResize);
        }, 1000);
    }
    hideSidebar() {
        const body = document.getElementsByTagName('body')[0];
        const sidebar = document.getElementsByClassName('sidebar')[0];

        if (misc.hide_sidebar_active === true) {
            setTimeout(function () {
                body.classList.remove('hide-sidebar');
                misc.hide_sidebar_active = false;
            }, 300);
            setTimeout(function () {
                sidebar.classList.remove('animation');
            }, 600);
            sidebar.classList.add('animation');

        } else {
            setTimeout(function () {
                body.classList.add('hide-sidebar');
                // $('.sidebar').addClass('animation');
                misc.hide_sidebar_active = true;
            }, 300);
        }

        // we simulate the window Resize so the charts will get updated in realtime.
        const simulateWindowResize = setInterval(function () {
            window.dispatchEvent(new Event('resize'));
        }, 180);

        // we stop the simulation of Window Resize after the animations are completed
        setTimeout(function () {
            clearInterval(simulateWindowResize);
        }, 1000);
    }

    ngOnInit() {

        this.getUserInfo();

        //Created by Diego.Perez. 09/14/2019
        if (localStorage.getItem('session') != null) {
            this.session = JSON.parse(localStorage.getItem('session'));
            // console.log(this.session);
            this.sessionUser = this.session.username;
        }

        // this.listTitles = ROUTES.filter(listTitle => listTitle);
        this.listTitles = ROUTES;
        // console.log("ROUTES>>>>>", ROUTES)

        const navbar: HTMLElement = this.element.nativeElement;
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton = navbar.getElementsByClassName('navbar-toggler')[0];
        if (body.classList.contains('sidebar-mini')) {
            misc.sidebar_mini_active = true;
        }
        if (body.classList.contains('hide-sidebar')) {
            misc.hide_sidebar_active = true;
        }
        this._router = this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
            this.sidebarClose();

            const $layer = document.getElementsByClassName('close-layer')[0];
            if ($layer) {
                $layer.remove();
            }
        });
    }

    onResize(event) {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    }
    sidebarOpen() {
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function () {
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');
        setTimeout(function () {
            $toggle.classList.add('toggled');
        }, 430);

        var $layer = document.createElement('div');
        $layer.setAttribute('class', 'close-layer');


        if (body.querySelectorAll('.main-panel')) {
            document.getElementsByClassName('main-panel')[0].appendChild($layer);
        } else if (body.classList.contains('off-canvas-sidebar')) {
            document.getElementsByClassName('wrapper-full-page')[0].appendChild($layer);
        }

        setTimeout(function () {
            $layer.classList.add('visible');
        }, 100);

        $layer.onclick = function () { //asign a function
            body.classList.remove('nav-open');
            this.mobile_menu_visible = 0;
            this.sidebarVisible = false;

            $layer.classList.remove('visible');
            setTimeout(function () {
                $layer.remove();
                $toggle.classList.remove('toggled');
            }, 400);
        }.bind(this);

        body.classList.add('nav-open');
        this.mobile_menu_visible = 1;
        this.sidebarVisible = true;
    };
    sidebarClose() {
        var $toggle = document.getElementsByClassName('navbar-toggler')[0];
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        var $layer = document.createElement('div');
        $layer.setAttribute('class', 'close-layer');

        this.sidebarVisible = false;
        body.classList.remove('nav-open');
        // $('html').removeClass('nav-open');
        body.classList.remove('nav-open');
        if ($layer) {
            $layer.remove();
        }

        setTimeout(function () {
            $toggle.classList.remove('toggled');
        }, 400);

        this.mobile_menu_visible = 0;
    };
    sidebarToggle() {
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    }

    /**
     * @remark This method returns the page title. If there is no title, it returns the URL.
     * @date 03/15/2020
     * @author Deivid Mafra
     */
    getTitle() {
        // console.log("this.listTitles>>>", this.listTitles)
        let urlPath: String = this.location.prepareExternalUrl(this.location.path()).substring(1, this.location.prepareExternalUrl(this.location.path()).length);
        for (let i = 0; i < this.listTitles.length; i++) {
            var title;
            for (let j = 0; j < this.listTitles[i].children.length; j++) {
                // console.log("urlPath>>>", urlPath)
                if (urlPath == this.listTitles[i].children[j].path) {
                    title = this.listTitles[i].children[j].title;
                    // console.log(title)
                    return title;
                } else if (urlPath.indexOf('/') == -1) {
                    // console.log("****");
                    title = urlPath;
                } else {
                    // console.log("#####");
                    title = urlPath.substring(0, urlPath.indexOf('/'));
                }
            }
        }
        return title;
    }

    getPath() {
        return this.location.prepareExternalUrl(this.location.path());
    }

    /**
      * @remark This method returns user inforamtion. It's storaged on user variable to shows up in the navbar.
      * @date 10/15/2019
      * @author Deivid Mafra
      */
    getUserInfo() {

        let url: string = '/User/getUserInfo/';

        this.service.getService(url).subscribe(
            (res) => {
                this.user = res.data;
                // console.log("this.user", this.user)

            },
            (err) => {
                console.log(err);
            })

    }
}
