import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  baseURL = 'http://localhost:52413/api/user/';
  decodedToken: any;
  tokenOk: any;

  jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { }

  // tslint:disable-next-line: typedef
  login(model: any) {
    return this.http
      .post(`${this.baseURL}Login`, model).pipe(
        map((response: any) => {
          const user = response;
          if (user) {
            localStorage.setItem('token', user.token);
            //this.decodedToken = this.jwtHelper.decodeToken(user.token);
            //sessionStorage.setItem('username', this.decodedToken.unique_name);
          }
        })
      );
  }


  // tslint:disable-next-line: typedef
  register(model: any) {
    return this.http.post(`${this.baseURL}Register`, model);
  }

  // tslint:disable-next-line: typedef
  loggedIn() {
    const token = localStorage.getItem('token');
    const tokenUser = token !== null ? token : '';

    return !this.jwtHelper.isTokenExpired(tokenUser);
  }

}
