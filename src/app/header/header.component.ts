import { Component, OnInit } from '@angular/core';
import { FormControl, NgForm } from '@angular/forms';
import { HostService } from '../service/host.service';
import { RenterService } from '../service/renter.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Renter } from '../model/renter';
import { Host } from '../model/host';
import { Observable } from 'rxjs';

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

  constructor(private hostService: HostService, private renterService: RenterService) {
    this.isRenterChecked = true; 
    this.isHostChecked = false;
    this.emailRecords = [];
    this.usernameRecords = [];
    this.hostService.getHosts().subscribe(
      (response: Host[]) => {
        console.log(response);
        for (let index = 0; index < response.length; index++) {
          this.emailRecords.push(response[index].email);
          this.usernameRecords.push(response[index].username);
        }
      }
    );
    this.renterService.getRenters().subscribe(
      (response: Renter[]) => {
        console.log(response);
        for (let index = 0; index < response.length; index++) {
          this.emailRecords.push(response[index].email);
          this.usernameRecords.push(response[index].username);
        }
      }
    );
  }

  ngOnInit(): void {}

  public onSignInUser(signInForm: NgForm) : void {
    document.getElementById('signIn-user-form')?.click();
    if(this.isRenterChecked) {
      this.renterService.addRenter(signInForm.value).subscribe(
        (response: Renter) => {
          console.log(response);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
    if(this.isHostChecked) {
      this.hostService.addHost(signInForm.value).subscribe(
        (response: Host) => {
          console.log(response);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
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
      button.setAttribute('data-target', '#logInModal')
    }

    if (mode === 'sign_in') {
      button.setAttribute('data-target', '#signInModal')
    }
    container?.appendChild(button);
    button.click();
  }

}
