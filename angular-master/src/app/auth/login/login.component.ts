import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';

import {AuthService} from '../../shared/auth.service';
import {gameN} from "../../game/gameN";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loading = false;
  error: any;
  submitted = false;

  loginForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) {
  }

  createForm() {
    this.loginForm = new FormGroup({
      email: new FormControl('', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(4)])),
    });
  }

  get password() {
    return this.loginForm.get('password');
  }

  get email() {
    return this.loginForm.get('email');
  }

  ngOnInit() {
    this.createForm();
    if (gameN.isAlive) {
      gameN.game.destroy(true);
    }
  }

  onSubmit() {
    const user = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
    };
    this.authService.onLogin(user)
      .subscribe(
        () => this.router.navigate(['/']),
        (error) => {
          console.log('erreur en retour : ', error);
          this.error = error;
          this.loading = false;
        }
      );
  }

}
