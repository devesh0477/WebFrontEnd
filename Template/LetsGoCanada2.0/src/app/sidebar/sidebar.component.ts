import { Component, OnInit } from '@angular/core';
import PerfectScrollbar from 'perfect-scrollbar';
import { GeneralService } from '../services/general.service';
import { RouterInfo } from '../models/routerInfo';

declare const $: any;

export interface RouteInfo {
    path: string;
    title: string;
    type: string;
    icontype: string;
    collapse?: string;
    children?: ChildrenItems[];
}

export interface ChildrenItems {
    path: string;
    title: string;
    ab: string;
    type?: string;
}

//Menu Items
export var ROUTES: RouteInfo[] = [];

@Component({
    selector: 'app-sidebar-cmp',
    templateUrl: 'sidebar.component.html',
    styleUrls: ['sidebar.component.css']
})

export class SidebarComponent implements OnInit {
    public menuItems: any[];
    // public user: string[];
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

    constructor(private service: GeneralService) { }

    isMobileMenu() {
        if ($(window).width() > 991) {
            return false;
        }
        return true;
    };

    ngOnInit() {
        this.getUserInfo();
        let url: string = '/Menu/getMenuPerRole';
        this.service.getService(url).subscribe(

            (res) => {
                let SOME: RouterInfo;
                if (res.length != null) {
                    for (let index = 0; index < res.length; index++) {
                        SOME = new RouterInfo();
                        SOME.path = res[index].path;
                        SOME.title = res[index].title;
                        SOME.type = res[index].type;
                        SOME.icontype = res[index].icontype;
                        SOME.collapse = res[index].collapse;
                        SOME.children = res[index].children;
                        ROUTES.push(SOME);
                    }
                } else {
                    SOME = new RouterInfo();
                    SOME.path = res.path;
                    SOME.title = res.title;
                    SOME.type = res.type;
                    SOME.icontype = res.icontype;
                    SOME.collapse = res.collapse;
                    SOME.children = res.children;
                    ROUTES.push(SOME);
                }
                this.menuItems = ROUTES;
                ROUTES = [];
            },
            (err) => {
                console.log(err)
            }
        )
    }
    updatePS(): void {
        if (window.matchMedia(`(min-width: 960px)`).matches && !this.isMac()) {
            const elemSidebar = <HTMLElement>document.querySelector('.sidebar .sidebar-wrapper');
            let ps = new PerfectScrollbar(elemSidebar, { wheelSpeed: 2, suppressScrollX: true });
        }
    }
    isMac(): boolean {
        let bool = false;
        if (navigator.platform.toUpperCase().indexOf('MAC') >= 0 || navigator.platform.toUpperCase().indexOf('IPAD') >= 0) {
            bool = true;
        }
        return bool;
    }

    /**
   * @remark This method returns user inforamtion. It's storaged on user variable to shows up in the sidebar.
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
