import { Component, OnInit } from '@angular/core';
import { GeneralService } from '../../services/general.service';
import { RouterInfo } from '../../models/routerInfo';

export var routes: RouterInfo[] = [];
@Component({
  selector: 'app-home-cmp',
  templateUrl: './home.component.html',
  styleUrls: ['home.component.css']
})
export class HomeComponent implements OnInit {
  public menuItems: any[];
  constructor(private service: GeneralService) { }

  ngOnInit() {
    this.getMenu();
  }

  /**
   * @remark This method returns all the menu options based on user role.
   * @date 10/10/2019
   * @author Deivid Mafra
   */
  getMenu() {
    let url: string = '/Menu/getMenuPerRole';
    this.service.getService(url).subscribe(
      (res) => {
        let menu: RouterInfo;

        if (res.length != null) {
          for (let index = 0; index < res.length; index++) {
            menu = new RouterInfo();
            menu.path = res[index].path;
            menu.title = res[index].title;
            menu.type = res[index].type;
            menu.icontype = res[index].icontype;
            menu.collapse = res[index].collapse;
            menu.children = res[index].children;
            routes.push(menu);

          }
        } else {
          menu = new RouterInfo();
          menu.path = res.path;
          menu.title = res.title;
          menu.type = res.type;
          menu.icontype = res.icontype;
          menu.collapse = res.collapse;
          menu.children = res.children;
          routes.push(menu);
        }
        // console.log("ROUTES ANTES", routes)
        this.menuItems = routes;
        routes = [];

        // console.log("ROUTES DEPOIS", routes)
        // console.log("this.menuItems>>>>>>>>>>", this.menuItems)
      },
      (err) => {
        console.log(err)
      }
    )
  }

  /**
 * @author Deivid Mafra;
 * @date 03/12/2020;
 * @remarks this method sets a scrollbar when the menu options has more then 4 sub-menus;
 * @param index It's representing the number of sub-menus.
 */
  showScroll(index: number) {
    if (index > 4) {
      const card = document.getElementById('menu-list');
      card.classList.add('setScroll');
    }
  }

}
