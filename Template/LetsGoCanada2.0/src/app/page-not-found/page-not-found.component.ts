import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.css']
})
export class PageNotFoundComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
    const body = document.getElementsByTagName('body')[0];
    const card = document.getElementsByClassName('card')[0];
    setTimeout(function () {
      card.classList.remove('card-hidden');
    }, 700);
  }

  ngOnDestroy() {
    const body = document.getElementsByTagName('body')[0];
    body.classList.remove('lock-page');
    body.classList.remove('off-canvas-sidebar');
  }

  backClicked() {
    this.router.navigate(['home']);
  }

}