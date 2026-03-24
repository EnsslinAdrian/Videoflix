
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UrlsService {
  baseUrl: string = environment.apiUrl;
  baseAuthUrl: string = this.baseUrl + '/auth/';

  // Authentication URLs
  registerUrl: string = this.baseAuthUrl + 'register/';
  loginUrl: string = this.baseAuthUrl + 'login/';
  passwordResetUrl: string = this.baseAuthUrl + 'password-reset/';
  passwordResetConfirmUrl: string = this.baseAuthUrl + 'password-reset/confirm/';
  logoutUrl: string = this.baseAuthUrl + 'logout/';
  meUrl: string = this.baseAuthUrl + 'me/';
  emailVerifyUrl: string = this.baseAuthUrl + 'verify-email/';
  authStatusUrl: string = this.baseAuthUrl + 'status/';
  refreshUrl: string = this.baseAuthUrl + 'refresh/';

  // Movie URLs
  moviesUrl: string = this.baseUrl + '/movie/';
  trailer: string = this.baseUrl + '/movie/trailer/';
  trailerMovieId: number = 13;

}

