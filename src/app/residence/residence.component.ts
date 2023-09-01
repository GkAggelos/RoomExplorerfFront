import { Component, OnInit } from '@angular/core';
import { Residence } from '../model/residence';
import { ResidenceService } from '../service/residence.service';
import { ActivatedRoute} from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Photo } from '../model/photo';
import { PhotoService } from '../service/photo.service';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Reservation } from '../model/reservation';
import { ReservationService } from '../service/reservation.service';
import { formatDate } from '@angular/common';
import { RenterService } from '../service/renter.service';
import { Renter } from '../model/renter';
import { MessageResponse } from '../model/messageResponse';
import { PageResponse } from '../model/pageResponse';
import * as Leaflet from 'leaflet';
import { Message } from '../model/message';
import { MessageService } from '../service/message.service';
import * as moment from 'moment';

@Component({
  selector: 'app-residence',
  templateUrl: './residence.component.html',
  styleUrls: ['./residence.component.css']
})
export class ResidenceComponent implements OnInit{
  public residence: Residence;
  public ishost: boolean;
  public isrenter: boolean;
  public id: number;
  public isWifiChecked: boolean;
  public isHeatingChecked: boolean;
  public isAirConditionChecked: boolean;
  public isCuisineChecked: boolean;
  public isTvChecked: boolean;
  public isParkingChecked: boolean;
  public isElevatorChecked: boolean;
  public isLivingRoomChecked: boolean;
  public photos: Photo[];
  public deletePhoto: Photo;
  public urls: String[];
  public names: String[];
  public renter_id: number = 0;
  public reservations: Reservation[] = [];
  public checkIn: string = "";
  public checkOut: string = "";
  public renter: Renter = {id:0, username:'', firstName:'', lastName:'', password:'', email:'', phoneNumber: '', photo: ''};
  public recordsNumberForReservation: number = 0;
  public fromRecordForReservation: number = 0;
  public toRecordForReservation: number = 0;
  public pagesForReservation: number = 1;
  public previousPageForReservation: number = 0;
  public nextPageForReservation: number = 0;
  public currentPageForReservation: number = 0;
  public roomType: string = "";
  public coordinateX: number = 0.0;
  public coordinateY: number = 0.0;
  public recordsNumberForMessage: number = 0;
  public fromRecordForMessage: number = 0;
  public toRecordForMessage: number = 0;
  public pagesForMessage: number = 1;
  public previousPageForMessage: number = 0;
  public nextPageForMessage: number = 0;
  public currentPageForMessage: number = 0;
  public messages: Message[] = [];
  public replyMessage: string = '';
  public messageId: number = 0;
  public deleteMessage: string = '';
  public deleteMessageId: number = 0;
  public unauthorized: boolean = false;
  

  constructor(private route: ActivatedRoute, private residenceService: ResidenceService, private photoService: PhotoService, private jwtHelper: JwtHelperService,
    private reservationService: ReservationService, private renterService: RenterService, private messageService: MessageService) { 
    this.ishost = false; 
    this.isrenter = false;
    this.id = 0;
    this.isWifiChecked = false;
    this.isHeatingChecked = false;
    this.isAirConditionChecked = false;
    this.isCuisineChecked = false;
    this.isTvChecked = false;
    this.isParkingChecked = false;
    this.isElevatorChecked = false;
    this.isLivingRoomChecked = false;
    this.photos = [];
    this.urls = [];
    this.names = [];

    this.residence = {id:0, photo:'', reviewsNumber: 0, starsAverage: 1, available_from:'', available_till:'', pricing:0.0, city:'', area:"", address:"", floor:0, 
    coordinateX:0.0, coordinateY: 0.0, peopleCapacity:0, roomType:0, comment:'', photos:[], bedNumber:0, bathroomNumber:0, bedroomNumber:0, acreage:0,
    host:{ id:1, username:'', firstName:'', lastName:'', password:'', email:'', phoneNumber: '', photo: '', approved:true}, 
    description:'', has_living_room: false, has_wifi:false, has_heating:false, has_air_condition:false, has_cuisine:false, has_tv:false, has_parking:false, has_elevator:false, reservations:[]};
    this.deletePhoto = {id:0, url:'', residence: this.residence};
  }

  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 10,
    center: { lat: 37.95591229014076, lng: 23.751258552074436 }
  }

  initMarker() {
    const initialMarkers = [
      {
        position: { lat: this.coordinateX, lng: this.coordinateY },
        draggable: false
      }
    ];
    for (let index = 0; index < initialMarkers.length; index++) {
      const data = initialMarkers[index];
      const marker = this.generateMarker(data, index);
      marker.addTo(this.map).bindPopup(`<b>${this.residence.address} <br>  ${this.residence.city}, ${this.residence.area}</b>`);
      this.map.panTo(data.position);
      this.markers.push(marker)
    }
  }

  generateMarker(data: any, index: number) {
    return Leaflet.marker(data.position, { draggable: data.draggable })
  }

  onMapReadyChange($event: Leaflet.Map) {
    this.map = $event;
    this.initMarker();
    var geocoder = (Leaflet.Control as any).geocoder({
      defaultMarkGeocode: true
    })
      .on('markgeocode', (e: { geocode: { center: any; }; }) => {
        var marker = e.geocode.center;
        this.coordinateX = marker.lat;
        this.coordinateY = marker.lng;
      })
      .addTo(this.map);
  }

  onMapReadyShow($event: Leaflet.Map) {
    this.map = $event;
  }

  public ngOnInit(): void {
    var temp: string;

    this.route.queryParams.subscribe((queryParam) =>{

      temp = queryParam?.['host'];
      if (temp === "true") this.ishost = true;

      temp = queryParam?.['renter'];
      if (temp === "true") this.isrenter = true;

      temp = queryParam?.['id'];
      this.id = parseInt(temp);
      this.checkIn = queryParam?.["check_in"];
      this.checkOut = queryParam?.["check_out"];

      var token = localStorage.getItem("token");
      if (token) {
        let decodedJwtData = this.jwtHelper.decodeToken(token);
        if (decodedJwtData.role === "renter") {
          this.renter_id = decodedJwtData.jti;
          this.renterService.getRenterById(this.renter_id).subscribe(
            (response: Renter) => {
              this.renter = response;
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

      this.reservationService.getReservationsByResidenceIdPagination(this.id, 0).subscribe(
        (response: PageResponse) => {
          this.reservations = response.response.content;

          for (let index = 0; index < this.reservations.length; index++) {
            if (this.reservations[index].review === null || this.reservations[index].review === '') {
              response.recordCount  -= 1;
            }
          }

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

      if (this.ishost) {
        this.messageService.getMessagesByResidenceIdPegination(this.id, 0).subscribe(
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

      this.residenceService.getResidenceById(this.id).subscribe(
        (response: Residence) => {
          this.residence = response;
          this.residence.available_from = this.residence.available_from.substring(0,10);
          this.residence.available_till = this.residence.available_till.substring(0,10);
          this.isWifiChecked = this.residence.has_wifi;
          this.isHeatingChecked = this.residence.has_heating;
          this.isAirConditionChecked = this.residence.has_air_condition;
          this.isCuisineChecked = this.residence.has_cuisine;
          this.isTvChecked = this.residence.has_tv;
          this.isParkingChecked = this.residence.has_parking;
          this.isElevatorChecked = this.residence.has_elevator;
          this.isLivingRoomChecked = this.residence.has_living_room;
          this.coordinateX = this.residence.coordinateX;
          this.coordinateY = this.residence.coordinateY;
          this.initMarker();
          if (this.residence.roomType.toString() == "PRIVATE") this.roomType = "0";
          if (this.residence.roomType.toString() == "SHARED") this.roomType = "1";
          if (this.residence.roomType.toString() == "HOUSE") this.roomType = "2";
          this.residenceService.getPhotosByResidenceId(response.id).subscribe(
            (response: Photo[]) => {
              this.photos = response;
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
          alert(error.message);
        }
      );
    });
  }

  public addReservation(): void {
    var reservation: Reservation = {id:0, stars:0, review:'', reservationDate:'', arrivalDate:'', leaveDate:'', state:-1, renter:this.renter, residence:this.residence};
    reservation.arrivalDate = this.checkIn;
    reservation.leaveDate = this.checkOut;
    reservation.state = 0;
    reservation.reservationDate = formatDate(new Date(), 'yyyy-MM-dd', 'en');
    this.reservationService.addReservation(reservation).subscribe(
      (response: MessageResponse) => {
        console.log(response);
        const container = document.getElementById('main-container');
        const button = document.createElement('button');
        button.type = 'button';
        button.style.display = 'none';
        button.setAttribute('data-toggle', 'modal');
        if (response.message === 'ok') button.setAttribute('data-target', '#warningOkModal');
        if (response.message === 'error') button.setAttribute('data-target', '#warningErrorModal');
        container?.appendChild(button);
        button.click();
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
    this.reservationService.getReservationsByResidenceIdPagination(this.id, page).subscribe(
      (response: PageResponse) => {
        this.reservations = response.response.content;
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
    this.messageService.getMessagesByResidenceIdPegination(this.id, page).subscribe(
      (response: PageResponse) => {
        this.messages = response.response.content;
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

  public onDeleteMessage(id: number): void {
    this.messageService.deleteMessage(id).subscribe(
      (response: any) => {
        console.log(response);
        this.messageService.getMessagesByResidenceIdPegination(this.id, 0).subscribe(
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
        alert(error.message);
      }
    );
  }

  public onAddMessage(addForm: NgForm, messageId: number): void {
    var message: Message = {id:0, residence:{id:0, photo:'', reviewsNumber: 0, starsAverage: 1, available_from:'', available_till:'', pricing:0.0, city:'', area:"", address:"", floor:0, 
                            coordinateX:0.0, coordinateY: 0.0, peopleCapacity:0, roomType:0, comment:'', photos:[], bedNumber:0, bathroomNumber:0, bedroomNumber:0, acreage:0,
                            host:{ id:1, username:'', firstName:'', lastName:'', password:'', email:'', phoneNumber: '', photo: '', approved:true}, 
                            description:'', has_living_room: false, has_wifi:false, has_heating:false, has_air_condition:false, has_cuisine:false, has_tv:false, has_parking:false, 
                            has_elevator:false, reservations:[]},
                            renter:{ id:1, username:'', firstName:'', lastName:'', password:'', email:'', phoneNumber: '', photo: ''}, sender:'host', date: '', message:'' }
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
            this.messageService.getMessagesByResidenceIdPegination(this.id, 0).subscribe(
              (response: PageResponse) => {
                this.onOpenModalSendedMessage();
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

  
  public onSendMessage(addForm: NgForm): void {
    var message: Message = {id:0, residence:{id:0, photo:'', reviewsNumber: 0, starsAverage: 1, available_from:'', available_till:'', pricing:0.0, city:'', area:"", address:"", floor:0, 
                            coordinateX:0.0, coordinateY: 0.0, peopleCapacity:0, roomType:0, comment:'', photos:[], bedNumber:0, bathroomNumber:0, bedroomNumber:0, acreage:0,
                            host:{ id:1, username:'', firstName:'', lastName:'', password:'', email:'', phoneNumber: '', photo: '', approved:true}, 
                            description:'', has_living_room: false, has_wifi:false, has_heating:false, has_air_condition:false, has_cuisine:false, has_tv:false, has_parking:false, 
                            has_elevator:false, reservations:[]},
                            renter:{ id:1, username:'', firstName:'', lastName:'', password:'', email:'', phoneNumber: '', photo: ''}, sender:'renter', date: '', message:'' }
    message.residence = this.residence;
    message.renter = this.renter;
    message.message = addForm.value.message;
    var date = Date.now();
    message.date = (moment(date)).format('YYYY-MM-DDTHH:mm:ss').toString();
    const button = document.getElementById('send-message-form');
    button?.click();
    this.messageService.addMessage(message).subscribe(
      (respnose: Message) => {
        this.onOpenModalSendedMessage();
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


  public onChangeState(state: number, reservation: Reservation) : void {
    reservation.state = state;
    this.reservationService.updateReservation(reservation).subscribe(
      (response: Reservation) => {
        console.log(response);
        this.reservationService.getReservationsByResidenceIdPagination(this.id, this.currentPageForReservation).subscribe(
          (response: PageResponse) => {
            this.reservations = response.response.content;  
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

  public onSelect(e: any) {
    if (e.target.files) {
      for (let i=0; i<File.length; i++) {
        this.names.push(e.target.files[i].name);
        var reader = new FileReader();
        reader.readAsDataURL(e.target.files[i]);
        reader.onload=(events:any)=>{
          this.urls.push(events.target.result);
        }
      }
    }
  }

  public onOpenModal(photo: Photo): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    this.deletePhoto = photo;
    button.setAttribute('data-target', '#deleteModal');
    container?.appendChild(button);
    button.click();
  }

  public onOpenModalSave(): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#saveModal');
    container?.appendChild(button);
    button.click();
  }

  public onOpenModalReplyMessage(message: string, messageId: number): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    this.messageId = messageId;
    this.replyMessage = message;
    button.setAttribute('data-target', '#replyMessageModal');
    container?.appendChild(button);
    button.click();
  }

  public onOpenModalDeleteMessage(message: string, messageId: number): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    this.deleteMessageId = messageId;
    this.deleteMessage = message;
    button.setAttribute('data-target', '#deleteMessageModal');
    container?.appendChild(button);
    button.click();
  }

  public onOpenModalSendedMessage(): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#sendedMessageModal');
    container?.appendChild(button);
    button.click();
  }

  public onOpenModalSendMessage(): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    button.setAttribute('data-target', '#sendMessageModal');
    container?.appendChild(button);
    button.click();
  }

  public onDeletePhoto(id: number): void {
    this.photoService.deletePhoto(id).subscribe(
      (response: void) => {
        console.log(response);
        this.residenceService.getPhotosByResidenceId(this.id).subscribe(
          (response: Photo[]) => {
            this.photos = response;
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

  public onEditResidence(editForm: NgForm): void {

    this.residence.available_from = editForm.value.startDate;
    this.residence.available_till = editForm.value.endDate;
    this.residence.city = editForm.value.city;
    this.residence.area = editForm.value.area;
    this.residence.address = editForm.value.address;
    this.residence.coordinateX = this.coordinateX;
    this.residence.coordinateY = this.coordinateY;
    this.residence.pricing = editForm.value.pricing;
    this.residence.floor = editForm.value.floor;
    this.residence.peopleCapacity = editForm.value.peopleCapacity;
    this.residence.bedNumber = editForm.value.bedNumber;
    this.residence.bedroomNumber = editForm.value.bedroomNumber;
    this.residence.bathroomNumber = editForm.value.bathroomNumber;
    this.residence.acreage = editForm.value.acreage;
    this.residence.comment = editForm.value.comment;
    this.residence.description = editForm.value.description;
    this.residence.roomType = editForm.value.roomType;
    this.residence.has_wifi = this.isWifiChecked
    this.residence.has_heating = this.isHeatingChecked;
    this.residence.has_air_condition = this.isAirConditionChecked;
    this.residence.has_cuisine = this.isCuisineChecked;
    this.residence.has_tv = this.isTvChecked;
    this.residence.has_parking = this.isParkingChecked;
    this.residence.has_elevator = this.isElevatorChecked;
    this.residence.has_living_room = this.isLivingRoomChecked;

    this.residenceService.updateResidence(this.residence).subscribe(
      (response: Residence) => {
        console.log(response);
        this.residence = response;
        this.residence.available_from = response.available_from.substring(0,10);
        this.residence.available_till = response.available_till.substring(0,10);
        this.onOpenModalSave();
        for (let index = 0; index < this.urls.length; index++) {
          this.photoService.addPhoto({id:0 , url: this.urls[index].toString() , residence: response}).subscribe(
            (response: Photo) => {
              console.log(response);
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
