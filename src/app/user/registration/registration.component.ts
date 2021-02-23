import { Component, OnInit } from '@angular/core';
import { Form, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { error } from 'protractor';
import { User } from 'src/app/_models/User';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {

  registerForm = {} as FormGroup;
  user = {} as User;

  constructor(private fb: FormBuilder, private router: Router, private authService: AuthService, private toastr: ToastrService) { }

  // tslint:disable-next-line: typedef
  ngOnInit() {
    this.validation();
  }


  // tslint:disable-next-line: typedef
  validation(){
    this.registerForm = this.fb.group({
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      userName: ['', Validators.required],
      // tslint:disable-next-line: deprecation
      passwords: this.fb.group({
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
      }, {validator: this.compararSenhas})
    });
  }

  // tslint:disable-next-line: typedef
  cadastrarUsuario() {
    if (this.registerForm.valid) {
      this.user = Object.assign({password: this.registerForm.get('passwords.password')?.value}, this.registerForm.value);
      this.authService.register(this.user).subscribe(
        () => {
          this.toastr.success('Cadastrado com sucesso');
          this.router.navigate(['/user/login']);
        },
        // tslint:disable-next-line: variable-name
        (retorno: any) => {
          const erro = retorno.error;
          erro.array.forEach((element: { code: any; }) => {
            switch (element.code) {
              case 'DuplicateUserName':
                this.toastr.error('Já existe um cadastro para esse usuário');
                break;
              default:
                this.toastr.error(`Erro no cadastro! CODE: ${element.code}`);
                break;
            }
          });
        }
      );
    }
  }

  // tslint:disable-next-line: typedef
  compararSenhas(fb: FormGroup) {
    const confirmSenhaCrtl = fb.get('confirmPassword');
    const confirmSenha = fb.get('password');

    if (confirmSenhaCrtl?.errors == null || 'mismatch' in confirmSenhaCrtl?.errors) {
      if (confirmSenha?.value === confirmSenhaCrtl?.value) {
        confirmSenhaCrtl?.setErrors(null);
      } else {
        confirmSenhaCrtl?.setErrors({mismatch: true});
      }
    }
  }

}
