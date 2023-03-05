import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-auth-page',
  templateUrl: './auth-page.component.html',
})
export class AuthPageComponent implements OnInit {
  form!: FormGroup;

  type: String = '';
  loading = false;
  firstSubmitted = false;

  serverMessage: { text: string; type: string } | undefined;

  constructor(
    private afAuth: AngularFireAuth,
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit() {
    this.type = this.router.url.replace('/', '');
    if (this.type === 'signup') {
      this.form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.minLength(6), Validators.required]],
        name: ['', this.type === 'signup' ? [Validators.required] : ''],
      });
    } else if (this.type === 'login') {
      this.form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.minLength(6), Validators.required]],
      });
    } else {
      this.form = this.fb.group({
        email: ['', [Validators.required, Validators.email]],
        password: [''],
      });
    }
  }

  changeType(val: any) {
    this.router.navigate([val]);
  }

  get email() {
    return this.form.get('email');
  }
  get password() {
    return this.form.get('password');
  }
  get name() {
    return this.form.get('name');
  }

  async onSubmit() {
    this.form.markAllAsTouched();
    this.form.markAsDirty();
    this.firstSubmitted = true;
    if (this.form.valid) {
      this.loading = true;

      const email = this.email?.value;
      const password = this.password?.value;
      const name = this.name?.value;

      try {
        if (this.type === 'login') {
          await this.afAuth.signInWithEmailAndPassword(email, password);
          this.router.navigate(['']);
        }
        if (this.type === 'signup') {
          const user = await this.afAuth.createUserWithEmailAndPassword(
            email,
            password
          );
          await user.user?.updateProfile({
            displayName: name,
          });
          this.router.navigate(['']);
        }
        if (this.type === 'password-reset') {
          await this.afAuth.sendPasswordResetEmail(email);
          this.email?.setValue('');
          this.firstSubmitted = false;
          this.serverMessage = {
            text: 'If your email address exists in our database, you will receive a password recovery link at your email address in a few minutes.',
            type: 'info',
          };
        }
      } catch (error: any) {
        this.serverMessage = {
          text: error.message
            .replace('Firebase: ', '')
            .replace(/ *\([^)]*\). */g, ''),
          type: 'warning',
        };
      }

      this.loading = false;
    } else {
    }
  }

  async signInGoogle() {
    this.loading = true;
    await this.afAuth
      .signInWithRedirect(new firebase.auth.GoogleAuthProvider())
      .then(() => {
        this.router.navigate(['']);
      })
      .catch((error) => {
        this.serverMessage = {
          text: error.message,
          type: 'warning',
        };
      });
    this.loading = false;
  }
}
