import { Component, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

const isLogin = signal(true);

@Component({
  selector: 'auth-login',
  template: `
    login

    <button (click)="showRegister()">register?</button>
  `,
  styleUrl: './auth-page.css'
})
export class AuthLogin {
  showRegister() {
    isLogin.set(false);
  }
}

@Component({
  selector: 'auth-register',
  template: `
    register

    <button (click)="showLogin()">login?</button>
  `,
  styleUrl: './auth-page.css'
})
export class AuthRegister {
  showLogin() {
    isLogin.set(true);
  }
}

@Component({
  selector: 'app-auth',
  imports: [NgComponentOutlet],
  template: `
    <div class="auth-container">
      <ng-container *ngComponentOutlet="getAuthComponent()" />
    </div>
  `,
  styleUrl: './auth-page.css'
})
export class AuthPage {getAuthComponent() {
    return isLogin() ? AuthLogin : AuthRegister;
  }
}