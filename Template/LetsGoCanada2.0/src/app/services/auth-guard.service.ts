import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot, CanActivate } from '@angular/router';
import { GeneralService } from './general.service';

@Injectable({
  providedIn: 'root'
})
// export class AuthGuardService implements CanActivate {
export class AuthGuardService implements CanActivate {
  private url = {
    'Path': ' ',
  };
  private answer: boolean;
  constructor(private router: Router, private validateURL: GeneralService /*private authService: AuthService*/) { }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    var s1 = state.url;
    this.url.Path = s1.substr(1);
    // console.log('"Path":', this.url)

    let url: string = '/Menu/validateURL';
    this.validateURL.post(url, this.url).subscribe(
      (res) => {

        if (res.data == true) {
        } else
          this.router.navigate(['403']);
      },
      (err) => {
        console.log(err)
      }
    )
    return true;
  }
}