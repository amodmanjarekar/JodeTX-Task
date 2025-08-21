import { Component, inject, signal } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Auth } from '../auth';
import { Router } from '@angular/router';

const isLogin = signal(true);

@Component({
  selector: 'auth-login',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-login.html',
  styleUrl: './auth-page.css',
})
export class AuthLogin {
  showRegister() {
    isLogin.set(false);
  }

  loginForm = new FormGroup({
    phone: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.pattern('[- +()0-9]{10,}')])
    ),
    password: new FormControl('', Validators.required),
  });

  private http = inject(HttpClient);
  private authService = inject(Auth);
  private router = inject(Router);

  onLoginSubmit() {
    this.http.post(`${environment.SERVER_URL}/auth/signin`, {
      phone: this.loginForm.get("phone")?.value,
      password: this.loginForm.get("password")?.value,
    }).subscribe({
      next: (res: any) => {
        localStorage.setItem("access_token", res.access_token)
        this.authService.isLoggedIn = true;
        this.router.navigate(["/"])
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
}

@Component({
  selector: 'auth-register',
  imports: [ReactiveFormsModule],
  templateUrl: './auth-register.html',
  styleUrl: './auth-page.css',
})
export class AuthRegister {
  showLogin() {
    isLogin.set(true);
  }

  registerForm = new FormGroup({
    name: new FormControl('', Validators.required),
    email: new FormControl('a@b.c', Validators.compose([Validators.required, Validators.email])),
    phone: new FormControl(
      '',
      Validators.compose([Validators.required, Validators.pattern('[- +()0-9]{10,}')])
    ),
    password: new FormControl('', Validators.required),
    repassword: new FormControl('', Validators.required),
  });

  private http = inject(HttpClient);

  onRegisterSubmit() {
    if (
      this.registerForm.valid &&
      this.registerForm.get('password')?.value === this.registerForm.get('repassword')?.value
    ) {
      this.http
        .post(`${environment.SERVER_URL}/admins`, {
          name: this.registerForm.get('name')?.value,
          phone: this.registerForm.get('phone')?.value,
          email: this.registerForm.get('email')?.value,
          password: this.registerForm.get('password')?.value,
        })
        .subscribe({
          next: (data) => {
            isLogin.set(true);
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else {
      return;
    }
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
  styleUrl: './auth-page.css',
})
export class AuthPage {
  getAuthComponent() {
    return isLogin() ? AuthLogin : AuthRegister;
  }
}
