import { Injectable } from '@angular/core';
import { GeneralService } from './general.service';
import { showNotification } from 'src/app/toast-message/toast-message';
import { Authorization } from 'src/app/models/Authorization';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private authorization: Authorization = new Authorization();

  constructor(private service: GeneralService, private router: Router) { }

  public login(username: string, password: string) {

    let url: string = '/Authorization/authenticate';

    this.authorization.Username = username;
    this.authorization.password = password;

    this.service.getCountry(url, this.authorization).subscribe(
      (res2: any) => {
        this.authorization.Country = res2.country_name;

        if (username != '' && password != '') {
          this.service.authentication(url, this.authorization).subscribe(
            (res) => {
              this.authorization.Country = res;

              if (res.message == 'Ok') {
                localStorage.setItem('session', JSON.stringify(res.data));
                if (res.data.temporaryPassword) {
                  this.router.navigate(['/userPassword']);
                } else {
                  this.router.navigate(['/home']);
                }
              }
            },
            (err) => {
              showNotification('top', 'right', 'danger', err.error.message + 1);
            }
          );
        }
      },
      (err) => {
        showNotification('top', 'right', 'danger', err.error.message + 2);
      }
    );
  }
}
