import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HostService } from '../service/host.service';
import { RenterService } from '../service/renter.service';
import { HttpErrorResponse } from '@angular/common/http';
import { UserService } from '../service/user.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Authenticate } from '../model/authenticate';
import { Register } from '../model/register';
import { Jwt } from '../model/Jwt';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  public isRenterChecked : boolean;
  public isHostChecked : boolean;
  public emailRecords : String[];
  public usernameRecords : String[];
  public token: String;
  public role: String = "";
  public username: String = "";
  public userId: number = 0;
  public authenticate: Authenticate = {username:'', password:'', role:''};
  public register: Register = {username:'', password:'', firstName:'', lastName:'', email:'', phoneNumber:'', role:''};

  constructor(private hostService: HostService, private renterService: RenterService, private userService: UserService, private jwtHelper: JwtHelperService, private route: Router) {
    this.isRenterChecked = true; 
    this.isHostChecked = false;
    this.emailRecords = [];
    this.usernameRecords = [];
    this.token = "";
  }

  ngOnInit(): void {
    //localStorage.removeItem("token");
    var token = localStorage.getItem("token");
    if (token) {
      let decodedJwtData = this.jwtHelper.decodeToken(token);
        this.role = decodedJwtData.role;
        this.username = decodedJwtData.sub;
        this.userId = decodedJwtData.jti;
    }
  }

  public loadData(): void {
    this.hostService.getUsernames().subscribe(
      (response: String[]) => {
        console.log(response);
        for (let index = 0; index < response.length; index++) {
          this.usernameRecords.push(response[index]);
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    this.renterService.getUsernames().subscribe(
      (response: String[]) => {
        console.log(response);
        for (let index = 0; index < response.length; index++) {
          this.usernameRecords.push(response[index]);
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    this.hostService.getEmails().subscribe(
      (response: String[]) => {
        console.log(response);
        for (let index = 0; index < response.length; index++) {
          this.emailRecords.push(response[index]);
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
    this.renterService.getEmails().subscribe(
      (response: String[]) => {
        console.log(response);
        for (let index = 0; index < response.length; index++) {
          this.emailRecords.push(response[index]);
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onLogOut(): void {
    this.userService.logOutUser().subscribe(
      (response: any) => {
        console.log(response);
        localStorage.removeItem("token");
        this.route.navigateByUrl('/');
        window.location.reload();
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    )
  }

  public onLogInUser(logInForm: NgForm): void {
    document.getElementById('logIn-user-form')?.click();
    this.authenticate.username = logInForm.value.username;
    this.authenticate.password = logInForm.value.password;
    this.authenticate.role = logInForm.value.log_in_role;
    this.userService.authenticateUser(this.authenticate).subscribe(
      (response: Jwt) => {
        console.log(response.token);
        this.token = response.token;
        localStorage.setItem("token", response.token);
        let decodedJwtData = this.jwtHelper.decodeToken(response.token);
        this.role = decodedJwtData.role;
        this.username = decodedJwtData.sub;
        this.userId = decodedJwtData.jti;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
     );
  }

  public onSignInUser(signInForm: NgForm) : void {
    document.getElementById('signIn-user-form')?.click();

    this.register.username = signInForm.value.username;
    this.register.password = signInForm.value.password;
    this.register.firstName = signInForm.value.firstName;
    this.register.lastName = signInForm.value.lastName;
    this.register.email = signInForm.value.email;
    this.register.phoneNumber = signInForm.value.phoneNumber;

    if (this.isHostChecked && this.isRenterChecked) {
      this.register.role = "host-renter"
      this.userService.registerUser(this.register).subscribe(
        (response: Jwt) => {
          console.log(response);
          this.token = response.token;
          this.onOpenModal('error');
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
    else if(this.isRenterChecked) {
      this.register.role = "renter"
      this.userService.registerUser(this.register).subscribe(
        (response: Jwt) => {
          console.log(response);
          this.token = response.token;
          window.location.reload();
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
    else if(this.isHostChecked) {
      this.register.role = "host"
      this.userService.registerUser(this.register).subscribe(
        (response: Jwt) => {
          console.log(response);
          this.token = response.token;
          this.onOpenModal('error');
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  }

  public refresh(): void {
    window.location.reload();
  }

  public passwordNotMatch(password: string, conf_password: string): boolean {
    
    if (conf_password?.length == 0 || password?.length == 0) return false;

    if (conf_password === password) return false

    return true;
  }

  public NoneChecked() : boolean {
    if (this.isHostChecked || this.isRenterChecked) return false;
    return true;
  }

  public onOpenModal(mode: string): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');

    if (mode === 'log_in') {
      button.setAttribute('data-target', '#logInModal');
    }

    if (mode === 'sign_in') {
      button.setAttribute('data-target', '#signInModal');
      this.loadData();
    }

    if (mode === 'error') {
      button.setAttribute('data-target', '#errorModal');
    }

    if (mode === 'log_out') {
      button.setAttribute('data-target', '#logOutModal');
      this.loadData();
    }

    container?.appendChild(button);
    button.click();
  }

}
