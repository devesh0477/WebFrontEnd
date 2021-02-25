import { Component, OnInit } from '@angular/core';


@Component({
  selector: 'app-school',
  templateUrl: './school.component.html',
  styleUrls: ['./school.component.css']
})
export class SchoolComponent implements OnInit {

  constructor() { }

  ngOnInit() {

    // this.miniSideBar()

  }

  ngOnDestroy() {

    this.maxSideBar();
  }

  /**
   * @author Deivid Mafra;
   * @date 07/16/2019;
   * @remarks This method minimize the sidebar element.
   */
  miniSideBar() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.add('sidebar-mini');
    // this.navBarComponet.sidebar_mini_active = true;
  }

  /**
   * @author Deivid Mafra;
   * @date 07/16/2019;
   * @remarks This method maximize the sidebar element.
   */
  maxSideBar() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('sidebar-mini');
    // this.navBarComponet.sidebar_mini_active = false;
  }
}