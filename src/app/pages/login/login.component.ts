import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { AuthService } from 'src/app/services/auth.service';
import { Subscription } from 'rxjs/internal/Subscription';

const googleLogoURL = "https://raw.githubusercontent.com/fireflysemantics/logo/master/Google.svg";
const facebookLogoURL = "https://upload.wikimedia.org/wikipedia/commons/c/c2/F_icon.svg";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  authSubscription: Subscription = null;
  noAuth: boolean = false;

  constructor(
    public auth: AuthService,
    private router: Router,
    private domSanitizer: DomSanitizer
  ) { 
    this.authSubscription = this.auth.user$.subscribe(val => {
      if(val) this.router.navigateByUrl('');
      else this.noAuth = true;
    })
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
  }

  googleSignin(): void {
    this.auth.googleSignin();
  }
}
