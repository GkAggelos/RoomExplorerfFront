
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Host } from '../model/host';
import { HostService } from '../service/host.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RenterService } from '../service/renter.service';
import { Renter } from '../model/renter';
import { NgForm } from '@angular/forms';
import { UserService } from '../service/user.service';
import { Jwt } from '../model/Jwt';
import { AdminService } from '../service/admin.service';
import { Admin } from '../model/admin';
import { ReservationService } from '../service/reservation.service';
import { Reservation } from '../model/reservation';


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public host: Host;
  public renter: Renter;
  public admin: Admin;
  public ishost: boolean;
  public isrenter: boolean;
  public isadmin: boolean;
  public isForAdmin: boolean;
  public emailRecords : String[];
  public usernameRecords : String[];
  public username:  String = "";
  public email: String = "";
  public id: number;
  public url: String = "";
  public deletePhoto: String = "";
  public reservations: Reservation[] = [];

  constructor(private route: ActivatedRoute, private hostService: HostService, private renterService: RenterService, 
    private userService: UserService, private router: Router, private adminService: AdminService, private reservationService: ReservationService) {
    this.host = {id:0, username:'', firstName:'', lastName:'', email:'', phoneNumber:'', approved:false, password:'', photo:''};
    this.renter = {id:0, username:'', firstName:'', lastName:'', email:'', phoneNumber:'', password:'', photo: ''};
    this.admin = {id:0, username:'', firstName:'', lastName:'', email:'', phoneNumber:'', password:'', photo: ''};
    this.ishost = false;
    this.isrenter = false;
    this.isadmin = false;
    this.isForAdmin = false;
    this.id = 0;

    this.emailRecords = [];
    this.usernameRecords = [];
  }

  public loadData(): void {
    this.hostService.getUsernames().subscribe(
      (response: String[]) => {
        console.log(response);
        for (let index = 0; index < response.length; index++) {
          if (this.username === response[index]) continue;
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
          if (this.username === response[index]) continue;
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
          if (this.email === response[index]) continue;
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
          if (this.email === response[index]) continue;
          this.emailRecords.push(response[index]);
        }
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
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

      temp = queryParam?.['admin'];
      if (temp === "true") this.isadmin = true;

      temp = queryParam?.['id'];
      this.id = parseInt(temp);

      if (this.isrenter && !this.isForAdmin) {
        this.reservationService.getReservationsByRenterId(this.id).subscribe(
          (response: Reservation[]) => {
            this.reservations = response;
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }

      if (this.ishost) {
        this.hostService.getHostById(this.id).subscribe(
          (response: Host) => {
            this.host = response;
            this.username = response.username;
            this.email = response.email;
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
            this.username = response.username;
            this.email = response.email
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }

      if (this.isadmin) {
        this.adminService.getAdminById(this.id).subscribe(
          (response: Admin) => {
            this.admin = response;
            this.username = response.username;
            this.email = response.email;
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      }
    });
  }

  public onSelect(e: any) {
    if (e.target.files) {
      var reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload=(events:any)=>{
        this.url = events.target.result;
      }
    }
  }

  public onEdit(editForm: NgForm): void {
    document.getElementById('edit-user-form')?.click();
    editForm.value.photo = this.url;

    if (this.ishost) {
      this.userService.updateUser(editForm.value, "host", this.host.username).subscribe(
        (response: Jwt) => {
          localStorage.setItem("token", response.token);
          this.hostService.getHostById(this.id).subscribe(
            (response: Host) => {
              this.host = response;
              this.username = response.username;
              this.email = response.email;
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            }
          );
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }

    if (this.isrenter) {
      this.userService.updateUser(editForm.value, "renter", this.renter.username).subscribe(
        (response: Jwt) => {
          localStorage.setItem("token", response.token);
          this.renterService.getRenterById(this.id).subscribe(
            (response: Renter) => {
              this.renter = response;
              this.username = response.username;
              this.email = response.email
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            }
          );
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }

    if (this.isadmin) {
      this.userService.updateUser(editForm.value, "admin", this.admin.username).subscribe(
        (response: Jwt) => {
          localStorage.setItem("token", response.token);
          this.adminService.getAdminById(this.id).subscribe(
            (response: Admin) => {
              this.admin = response;
              this.username = response.username;
              this.email = response.email
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            }
          );
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }

  }

  public onDeleteAccount(): void {
    if (this.ishost) {
      this.userService.deleteUser("host", this.host.username).subscribe(
        (response: any) => {
          console.log(response);
          localStorage.removeItem("token");
          this.router.navigateByUrl('/');
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }

    if (this.isrenter) {
      this.userService.deleteUser("renter", this.renter.username).subscribe(
        (response: any) => {
          console.log(response);
          localStorage.removeItem("token");
          this.router.navigateByUrl('/');
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }
  }

  public onDeletePhoto(): void {
    if (this.ishost) {
      this.host.photo = '';
      this.userService.updateUser(this.host, "host", this.host.username).subscribe(
        (response: Jwt) => {
          localStorage.setItem("token", response.token);
          this.hostService.getHostById(this.id).subscribe(
            (response: Host) => {
              this.host = response;
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            }
          );
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }

    if (this.isrenter) {
      this.renter.photo = '';
      this.userService.updateUser(this.renter, "renter", this.renter.username).subscribe(
        (response: Jwt) => {
          localStorage.setItem("token", response.token);
          this.renterService.getRenterById(this.id).subscribe(
            (response: Renter) => {
              this.renter = response;
              this.username = response.username;
              this.email = response.email
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            }
          );
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }

    if (this.isadmin) {
      this.admin.photo = '';
      this.userService.updateUser(this.admin, "admin", this.admin.username).subscribe(
        (response: Jwt) => {
          localStorage.setItem("token", response.token);
          this.adminService.getAdminById(this.id).subscribe(
            (response: Admin) => {
              this.admin = response;
              this.username = response.username;
              this.email = response.email
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            }
          );
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    }

  }

  public onOpenModal(mode: string, photo: string): void {
    const container = document.getElementById('main-container');
      const button = document.createElement('button');
      button.type = 'button';
      button.style.display = 'none';
      button.setAttribute('data-toggle', 'modal');

      if (mode === 'edit') {
        button.setAttribute('data-target', '#updateUserModal');
        this.loadData();
      }
      if (mode === 'deletePhoto') {
        this.deletePhoto = photo;
        button.setAttribute('data-target', '#deletePhotoModal');
      }
      if (mode === 'deleteAccount') {
        this.deletePhoto = photo;
        button.setAttribute('data-target', '#deleteAccountModal');
      }

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