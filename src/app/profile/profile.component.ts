
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
import { PageResponse } from '../model/pageResponse';
import { User } from '../model/user';
import { ResidenceService } from '../service/residence.service';
import { Residence } from '../model/residence';
import { Message } from '../model/message';
import { MessageService } from '../service/message.service';
import * as moment from 'moment';
import { Photo } from '../model/photo';


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
  public recordsNumberForReservation: number = 0;
  public fromRecordForReservation: number = 0;
  public toRecordForReservation: number = 0;
  public pagesForReservation: number = 1;
  public previousPageForReservation: number = 0;
  public nextPageForReservation: number = 0;
  public currentPageForReservation: number = 0;
  public user: User;
  public messages: Message[] = [];
  public recordsNumberForMessage: number = 0;
  public fromRecordForMessage: number = 0;
  public toRecordForMessage: number = 0;
  public pagesForMessage: number = 1;
  public previousPageForMessage: number = 0;
  public nextPageForMessage: number = 0;
  public currentPageForMessage: number = 0;
  public deleteMessage: string = '';
  public deleteMessageId: number = 0;
  public replyMessage: string = '';
  public messageId: number = 0;
  public unauthorized: boolean = false;
  public results: Residence[] = [];

  constructor(private route: ActivatedRoute, private hostService: HostService, private renterService: RenterService, 
    private userService: UserService, private router: Router, private adminService: AdminService, private reservationService: ReservationService,
    private residenceService: ResidenceService, private messageService: MessageService) {
    this.host = {id:0, username:'', firstName:'', lastName:'', email:'', phoneNumber:'', approved:false, password:'', photo:''};
    this.renter = {id:0, username:'', firstName:'', lastName:'', email:'', phoneNumber:'', password:'', photo: ''};
    this.admin = {id:0, username:'', firstName:'', lastName:'', email:'', phoneNumber:'', password:'', photo: ''};
    this.user = {username:'', firstName:'', lastName:'', email:'', phoneNumber:'', password:'', photo: ''};
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
        this.reservationService.getReservationsByRenterIdPagination(this.id, 0).subscribe(
          (response: PageResponse) => {
            this.reservations = response.response.content;
            this.recordsNumberForReservation = response.recordCount;

            if (response.recordCount > 0) this.fromRecordForReservation = 1;
            if (response.recordCount <= 10) this.toRecordForReservation = response.recordCount;
            else this.toRecordForReservation = 10;
        
            var number = Math.floor(response.recordCount / 10);
            if (response.recordCount % 10 !== 0)  this.pagesForReservation = number + 1;
            else this.pagesForReservation = number;
        
            this.previousPageForReservation = -1;
            if (this.recordsNumberForReservation !== this.toRecordForReservation) this.nextPageForReservation = 1;
            else this.nextPageForReservation = -1; 
          },
          (error: HttpErrorResponse) => {
            if (error.status == 403) {
              this.unauthorized = true;
            }
            else {
              alert(error.message);
            }
          }
        );

        this.residenceService.getRecommendedResidencesByRenterId(this.id).subscribe(
          (response: Residence[]) => {
            this.results = response;

            for (let index = 0; index < this.results.length; index++) {
              this.residenceService.getPhotosByResidenceId(this.results[index].id).subscribe(
                (response: Photo[]) => {
                  this.results[index].photo = response[0].url;
                },
                (error: HttpErrorResponse) => {
                  alert(error.message);
                }
              );
            }
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );

        this.messageService.getMessagesByRenterIdPegination(this.id, 0).subscribe(
          (response: PageResponse) => {
            this.messages = response.response.content;
            this.recordsNumberForMessage = response.recordCount;

            if (response.recordCount > 0) this.fromRecordForMessage = 1;
            if (response.recordCount <= 10) this.toRecordForMessage = response.recordCount;
            else this.toRecordForMessage = 10;
        
            var number = Math.floor(response.recordCount / 10);
            if (response.recordCount % 10 !== 0)  this.pagesForMessage = number + 1;
            else this.pagesForMessage = number;
        
            this.previousPageForMessage = -1;
            if (this.recordsNumberForMessage !== this.toRecordForMessage) this.nextPageForMessage = 1;
            else this.nextPageForMessage = -1; 
          },
          (error: HttpErrorResponse) => {
            if (error.status == 403) {
              this.unauthorized = true;
            }
            else {
              alert(error.message);
            }
          }
        );
      }

      if (this.ishost) {
        this.hostService.getHostById(this.id).subscribe(
          (response: Host) => {
            this.host = response;
            this.username = response.username;
            this.email = response.email;
            this.user.username = this.host.username;
            this.user.firstName = this.host.firstName;
            this.user.lastName = this.host.lastName;
            this.user.email = this.host.email;
            this.user.phoneNumber = this.host.phoneNumber;
          },
          (error: HttpErrorResponse) => {
            if (error.status == 403) {
              this.unauthorized = true;
            }
            else {
              alert(error.message);
            }
          }
        );
      }

      if (this.isrenter) {
        this.renterService.getRenterById(this.id).subscribe(
          (response: Renter) => {
            this.renter = response;
            this.username = response.username;
            this.email = response.email;
            this.user.username = this.renter.username;
            this.user.firstName = this.renter.firstName;
            this.user.lastName = this.renter.lastName;
            this.user.email = this.renter.email;
            this.user.phoneNumber = this.renter.phoneNumber;
          },
          (error: HttpErrorResponse) => {
            if (error.status == 403) {
              this.unauthorized = true;
            }
            else {
              alert(error.message);
            }
          }
        );
      }

      if (this.isadmin) {
        this.adminService.getAdminById(this.id).subscribe(
          (response: Admin) => {
            this.admin = response;
            this.username = response.username;
            this.email = response.email;
            this.user.username = this.admin.username;
            this.user.firstName = this.admin.firstName;
            this.user.lastName = this.admin.lastName;
            this.user.email = this.admin.email;
            this.user.phoneNumber = this.admin.phoneNumber;
          },
          (error: HttpErrorResponse) => {
            if (error.status == 403) {
              this.unauthorized = true;
            }
            else {
              alert(error.message);
            }
          }
        );
      }
    });
  }

  public downloadResidences(id: number): void {
    this.residenceService.getHostResidences(id).subscribe(
      (response: Residence[]) => {
        let blob: Blob = new Blob([JSON.stringify(response, null, 2)], {
          type: "application/json"
        });
        let a = document.createElement("a");
        a.download = "residences.json";
        a.href = window.URL.createObjectURL(blob);
        a.click();
      },
      (error: HttpErrorResponse) => {
        if (error.status == 403) {
          this.unauthorized = true;
        }
        else {
          alert(error.message);
        }
      }
    );
  }

  public downloadReservationsForRenter(id: number): void {
    this.reservationService.getReservationsByRenterId(id).subscribe(
      (response: Reservation[]) => {
        let blob: Blob = new Blob([JSON.stringify(response, null, 2)], {
          type: "application/json"
        });
        let a = document.createElement("a");
        a.download = "reservationsForRenter.json";
        a.href = window.URL.createObjectURL(blob);
        a.click();
      },
      (error: HttpErrorResponse) => {
        if (error.status == 403) {
          this.unauthorized = true;
        }
        else {
          alert(error.message);
        }
      }
    );
  }

  public downloadReservationsForHost(id: number): void {
    this.reservationService.getReservationsByHostId(id).subscribe(
      (response: Reservation[]) => {
        let blob: Blob = new Blob([JSON.stringify(response, null, 2)], {
          type: "application/json"
        });
        let a = document.createElement("a");
        a.download = "reservationsForHost.json";
        a.href = window.URL.createObjectURL(blob);
        a.click();
      },
      (error: HttpErrorResponse) => {
        if (error.status == 403) {
          this.unauthorized = true;
        }
        else {
          alert(error.message);
        }
      }
    );
  }

  public createRange(number: number){
    return new Array(number);
  }

  public onChangePageForReservation(page: number) {
    this.reservationService.getReservationsByRenterIdPagination(this.id, page).subscribe(
      (response: PageResponse) => {
        this.reservations = response.response.content;
        this.recordsNumberForReservation = response.recordCount;
        this.currentPageForReservation = page;

        this.fromRecordForReservation = 1;
        if (response.recordCount <= 10) this.toRecordForReservation = response.recordCount;
        else this.toRecordForReservation = 10;
        for (let index = 0; index < page; index++) {
          this.fromRecordForReservation += 10;
          this.toRecordForReservation += 10;
        }
        if (this.toRecordForReservation > response.recordCount) this.toRecordForReservation = response.recordCount;

        this.previousPageForReservation = page - 1;
        if (response.recordCount !== this.toRecordForReservation) this.nextPageForReservation = page + 1;
        else this.nextPageForReservation = -1; 
      },
      (error: HttpErrorResponse) => {
        if (error.status == 403) {
          this.unauthorized = true;
        }
        else {
          alert(error.message);
        }
      }
    );
  }

  public onChangePageForMessage(page: number) {
    this.messageService.getMessagesByRenterIdPegination(this.id, page).subscribe(
      (response: PageResponse) => {
        this.messages = response.response.content;
        this.recordsNumberForMessage = response.recordCount;
        this.currentPageForMessage = page;

        this.fromRecordForMessage = 1;
        if (response.recordCount <= 10) this.toRecordForMessage = response.recordCount;
        else this.toRecordForMessage = 10;
        for (let index = 0; index < page; index++) {
          this.fromRecordForMessage += 10;
          this.toRecordForMessage += 10;
        }
        if (this.toRecordForMessage > response.recordCount) this.toRecordForMessage = response.recordCount;

        this.previousPageForMessage = page - 1;
        if (response.recordCount !== this.toRecordForMessage) this.nextPageForMessage = page + 1;
        else this.nextPageForMessage = -1; 
      },
      (error: HttpErrorResponse) => {
        if (error.status == 403) {
          this.unauthorized = true;
        }
        else {
          alert(error.message);
        }
      }
    );
  }

  public showDate(date: string): string {
    return date.substring(0,10);
  }

  public showTime(date: string): string {
    return date.substring(11,19);
  }

  public onDeleteMessage(id: number): void {
    this.messageService.deleteMessage(id).subscribe(
      (response: any) => {
        console.log(response);
        this.messageService.getMessagesByRenterIdPegination(this.id, 0).subscribe(
          (response: PageResponse) => {
            this.messages = response.response.content;
            this.recordsNumberForMessage = response.recordCount;

            if (response.recordCount > 0) this.fromRecordForMessage = 1;
            if (response.recordCount <= 10) this.toRecordForMessage = response.recordCount;
            else this.toRecordForMessage = 10;
        
            var number = Math.floor(response.recordCount / 10);
            if (response.recordCount % 10 !== 0)  this.pagesForMessage = number + 1;
            else this.pagesForMessage = number;
        
            this.previousPageForMessage = -1;
            if (this.recordsNumberForMessage !== this.toRecordForMessage) this.nextPageForMessage = 1;
            else this.nextPageForMessage = -1

            this.currentPageForMessage = 0;
          },
          (error: HttpErrorResponse) => {
            alert(error.message);
          }
        );
      },
      (error: HttpErrorResponse) => {
        if (error.status == 403) {
          this.unauthorized = true;
        }
        else {
          alert(error.message);
        }
      }
    );
  }

  public onAddMessage(addForm: NgForm, messageId: number): void {
    var message: Message = {id:0, residence:{id:0, photo:'', reviewsNumber: 0, starsAverage: 1, available_from:'', available_till:'', pricing:0.0, city:'', area:"", address:"", floor:0, 
                            coordinateX:0.0, coordinateY: 0.0, peopleCapacity:0, roomType:0, comment:'', photos:[], bedNumber:0, bathroomNumber:0, bedroomNumber:0, acreage:0,
                            host:{ id:1, username:'', firstName:'', lastName:'', password:'', email:'', phoneNumber: '', photo: '', approved:true}, 
                            description:'', has_living_room: false, has_wifi:false, has_heating:false, has_air_condition:false, has_cuisine:false, has_tv:false, has_parking:false, 
                            has_elevator:false, reservations:[]},
                            renter:{ id:1, username:'', firstName:'', lastName:'', password:'', email:'', phoneNumber: '', photo: ''}, sender:"renter", date: '', message:'' }
    this.messageService.getMessageById(messageId).subscribe(
      (respnose: Message) => {
        message.residence = respnose.residence;
        message.renter = respnose.renter;
        message.message = addForm.value.message;
        var date = Date.now();
        message.date = (moment(date)).format('YYYY-MM-DDTHH:mm:ss').toString();
        const button = document.getElementById('reply-message-form');
        button?.click();
        this.messageService.addMessage(message).subscribe(
          (respnose: Message) => {
            this.messageService.getMessagesByRenterIdPegination(this.id, 0).subscribe(
              (response: PageResponse) => {
                this.onOpenModal('messageSend', '', '', 0);
                this.messages = response.response.content;
                this.recordsNumberForMessage = response.recordCount;
    
                if (response.recordCount > 0) this.fromRecordForMessage = 1;
                if (response.recordCount <= 10) this.toRecordForMessage = response.recordCount;
                else this.toRecordForMessage = 10;
            
                var number = Math.floor(response.recordCount / 10);
                if (response.recordCount % 10 !== 0)  this.pagesForMessage = number + 1;
                else this.pagesForMessage = number;
            
                this.previousPageForMessage = -1;
                if (this.recordsNumberForMessage !== this.toRecordForMessage) this.nextPageForMessage = 1;
                else this.nextPageForMessage = -1
    
                this.currentPageForMessage = 0;
              },
              (error: HttpErrorResponse) => {
                if (error.status == 403) {
                  this.unauthorized = true;
                }
                else {
                  alert(error.message);
                }
              }
            );
          },
          (error: HttpErrorResponse) => {
            if (error.status == 403) {
              this.unauthorized = true;
            }
            else {
              alert(error.message);
            }
          }
        );
      },
      (error: HttpErrorResponse) => {
        if (error.status == 403) {
          this.unauthorized = true;
        }
        else {
          alert(error.message);
        }
      }
    );
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
              if (error.status == 403) {
                this.unauthorized = true;
              }
              else {
                alert(error.message);
              }
            }
          );
        },
        (error: HttpErrorResponse) => {
          if (error.status == 403) {
            this.unauthorized = true;
          }
          else {
            alert(error.message);
          }
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
          if (error.status == 403) {
            this.unauthorized = true;
          }
          else {
            alert(error.message);
          }
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
          if (error.status == 403) {
            this.unauthorized = true;
          }
          else {
            alert(error.message);
          }
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
          if (error.status == 403) {
            this.unauthorized = true;
          }
          else {
            alert(error.message);
          }
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
          if (error.status == 403) {
            this.unauthorized = true;
          }
          else {
            alert(error.message);
          }
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
              if (error.status == 403) {
                this.unauthorized = true;
              }
              else {
                alert(error.message);
              }
            }
          );
        },
        (error: HttpErrorResponse) => {
          if (error.status == 403) {
            this.unauthorized = true;
          }
          else {
            alert(error.message);
          }
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
              if (error.status == 403) {
                this.unauthorized = true;
              }
              else {
                alert(error.message);
              }
            }
          );
        },
        (error: HttpErrorResponse) => {
          if (error.status == 403) {
            this.unauthorized = true;
          }
          else {
            alert(error.message);
          }
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
              if (error.status == 403) {
                this.unauthorized = true;
              }
              else {
                alert(error.message);
              }
            }
          );
        },
        (error: HttpErrorResponse) => {
          if (error.status == 403) {
            this.unauthorized = true;
          }
          else {
            alert(error.message);
          }
        }
      );
    }

  }

  public onOpenModal(mode: string, photo: string, message: string, messageId: number): void {
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
      if(mode === 'replyMessage') {
        this.replyMessage = message;
        this.messageId = messageId;
        button.setAttribute('data-target', '#replyMessageModal')
      }
      if (mode === 'deleteMessage') {
        this.deleteMessage = message;
        this.deleteMessageId = messageId;
        button.setAttribute('data-target', '#deleteMessageModal')
      }
      if(mode === 'messageSend') {
        button.setAttribute('data-target', '#sendMessageModal')
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
        if (error.status == 403) {
          this.unauthorized = true;
        }
        else {
          alert(error.message);
        }
      }
    );
  }

}