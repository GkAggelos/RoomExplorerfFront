
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Host } from '../model/host';
import { HostService } from '../service/host.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RenterService } from '../service/renter.service';
import { Renter } from '../model/renter';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public host: Host;
  public renter: Renter;
  public ishost: boolean;
  public isrenter: boolean;
  public isForAdmin: boolean;
  public emailRecords : String[];
  public usernameRecords : String[];
  public id: number;

  constructor(private route: ActivatedRoute, private hostService: HostService, private renterService: RenterService) {
    this.host = {id:0, username:'', firstName:'', lastName:'', email:'', phoneNumber:'', approved:false, password:''};
    this.renter = {id:0, username:'', firstName:'', lastName:'', email:'', phoneNumber:'', password:''};
    this.ishost = false;
    this.isrenter = false;
    this.isForAdmin = false;
    this.id = 0;

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

  public ngOnInit(): void {
    var temp: string;
    this.route.queryParams.subscribe((queryParam) =>{
      temp = queryParam?.['isForAdmin'];
      if (temp === "true") this.isForAdmin = true;

      temp = queryParam?.['host'];
      if (temp === "true") this.ishost = true;

      temp = queryParam?.['renter'];
      if (temp === "true") this.isrenter = true;

      temp = queryParam?.['id'];
      this.id = parseInt(temp);

      if (this.ishost) {
        this.hostService.getHostById(this.id).subscribe(
          (response: Host) => {
            this.host = response;
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }

      if (this.isrenter) {
        this.renterService.getRenterById(this.id).subscribe(
          (response: Renter) => {
            this.renter = response;
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }
    });
  }

  public  onOpenModal(): void {
    const container = document.getElementById('main-container');
      const button = document.createElement('button');
      button.type = 'button';
      button.style.display = 'none';
      button.setAttribute('data-toggle', 'modal');
      button.setAttribute('data-target', '#updateUserModal')
      container?.appendChild(button);
      button.click();
    }

  public passwordNotMatch(password: string, conf_password: string): boolean {
    
    if (conf_password?.length == 0 || password?.length == 0) return false;
  
    if (conf_password === password) return false
  
    return true;
  }

  public onApproveHost(): void {
    this.host.approved = true;
    this.hostService.updateHost(this.host).subscribe(
      (response: Host) => {
        this.host = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

}