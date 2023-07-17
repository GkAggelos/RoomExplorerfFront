import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { HostService } from '../host.service';
import { RenterService } from '../renter.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Renter } from '../model/renter';
import { Host } from '../model/host';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{

  public isRenterChecked : boolean;
  public isHostChecked : boolean;

  constructor(private hostService: HostService, private renterService: RenterService) {this.isRenterChecked = true; this.isHostChecked = false;}

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
