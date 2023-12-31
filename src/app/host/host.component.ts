import { Component, OnInit } from '@angular/core';
import { Residence } from '../model/residence';
import { Host } from '../model/host';
import { ResidenceService } from '../service/residence.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { PhotoService } from '../service/photo.service';
import { Photo } from '../model/photo';
import { ActivatedRoute } from '@angular/router';
import { HostService } from '../service/host.service';
import { PageResponse } from '../model/pageResponse';
import * as Leaflet from 'leaflet';
import "leaflet-control-geocoder";

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css']
})
export class HostComponent implements OnInit{

  public residences: Residence[];
  public deleteResidence: Residence = {id:0, reviewsNumber: 0, starsAverage: 1, photo:'',available_from:'', available_till:'', pricing:0.0, city:'', area:"", address: "" ,floor:0, 
  coordinateX:0.0, coordinateY:0.0, peopleCapacity:0, roomType:0, comment:'', photos:[], bedNumber:0, bathroomNumber:0, bedroomNumber:0, acreage:0,
  host:{id:0, username:'', firstName:'', lastName:'', password:'', email:'', phoneNumber: '', photo:'', approved:false}, description:'', has_living_room: false, has_wifi:false, has_heating:false, has_air_condition:false, has_cuisine:false, has_tv:false,
  has_parking:false, has_elevator:false, reservations:[]};
  public urls: String[];
  public names: String[];
  public id: number = 0;
  public host: Host = {id:0, username:'', firstName:'', lastName:'', password:'', email:'', phoneNumber: '', photo:'', approved:false};
  public photos: Photo[] = [];
  public recordsNumber: number = 0;
  public fromRecord: number = 0;
  public toRecord: number = 0;
  public pages: number = 1;
  public previousPage: number = 0;
  public nextPage: number = 0;
  public currentPage: number = 0;
  public roomType: string = "";
  public coordinateX: number = 0.0;
  public coordinateY: number = 0.0;
  public NoneCoordinate: boolean = true;
  public unauthorized: boolean = false; 

  constructor(private residenceService: ResidenceService, private photoService: PhotoService, private route: ActivatedRoute, private hostServise: HostService) {
    this.residences = [];
    this.urls = [];
    this.names = [];
  }

  map!: Leaflet.Map;
  markers: Leaflet.Marker[] = [];
  options = {
    layers: [
      Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      })
    ],
    zoom: 5,
    center: { lat: 37.95591229014076, lng: 23.751258552074436 }
  }

  onMapReady($event: Leaflet.Map) {
    this.map = $event;
    var geocoder = (Leaflet.Control as any).geocoder({
      defaultMarkGeocode: true
    })
      .on('markgeocode', (e: { geocode: { center: any; }; }) => {
        var marker = e.geocode.center;
        this.coordinateX = marker.lat;
        this.coordinateY = marker.lng;
        this.NoneCoordinate = false;
      })
      .addTo(this.map);
  }


  ngOnInit(): void {
    var temp: string;
    this.route.queryParams.subscribe((queryParam) =>{
      temp = queryParam?.['id'];
      this.id = parseInt(temp);
      this.getHost();
      this.getResidences();
      this.roomType = "2";
    });
  }

  public getHost(): void {
    this.hostServise.getHostById(this.id).subscribe(
      (response: Host) => {
        this.host = response;
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

  public createRange(number: number){
    return new Array(number);
  }

  public onChangePage(page: number) {
    this.residenceService.getHostResidencesPagination(this.id, page).subscribe(
      (response: PageResponse) => {
        this.residences = response.response.content;
        this.recordsNumber = response.recordCount;
        this.currentPage = page;

        this.fromRecord = 1;
        if (response.recordCount <= 10) this.toRecord = response.recordCount;
        else this.toRecord = 10;
        for (let index = 0; index < page; index++) {
          this.fromRecord += 10;
          this.toRecord += 10;
        }
        if (this.toRecord > response.recordCount) this.toRecord = response.recordCount;

        this.previousPage = page - 1;
        if (response.recordCount !== this.toRecord) this.nextPage = page + 1;
        else this.nextPage = -1; 
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


  public getResidences(): void {

    this.residenceService.getHostResidencesPagination(this.id, 0).subscribe(
      (response: PageResponse) => {
        this.residences = response.response.content;
        this.recordsNumber = response.recordCount;

        if (response.recordCount > 0) this.fromRecord = 1;
        if (response.recordCount <= 10) this.toRecord = response.recordCount;
        else this.toRecord = 10;
        
        var number = Math.floor(response.recordCount / 10);
        if (response.recordCount % 10 !== 0)  this.pages = number + 1;
        else this.pages = number;
        
        this.previousPage = -1;
        if (this.recordsNumber !== this.toRecord) this.nextPage = 1;
        else this.nextPage = -1 
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
        var reader = new FileReader();
        this.names.push(e.target.files[i].name);
        reader.readAsDataURL(e.target.files[i]);
        reader.onload=(events:any)=>{
          this.urls.push(events.target.result);
        }
      }
    }
  }

  public onDeleteResidence(id: number): void {
    this.residenceService.deleteResidence(id).subscribe(
      (response: any) => {
        console.log(response);
        this.residenceService.getHostResidencesPagination(this.id, 0).subscribe(
          (response: PageResponse) => {
            this.residences = response.response.content;
            this.recordsNumber = response.recordCount;

            if (response.recordCount > 0) this.fromRecord = 1;
            if (response.recordCount <= 10) this.toRecord = response.recordCount;
            else this.toRecord = 10;
        
            var number = Math.floor(response.recordCount / 10);
            if (response.recordCount % 10 !== 0)  this.pages = number + 1;
            else this.pages = number;
        
            this.previousPage = -1;
            if (this.recordsNumber !== this.toRecord) this.nextPage = 1;
            else this.nextPage = -1

            this.currentPage = 0;
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

  public onOpenModal(residence: Residence): void {
    const container = document.getElementById('main-container');
    const button = document.createElement('button');
    button.type = 'button';
    button.style.display = 'none';
    button.setAttribute('data-toggle', 'modal');
    this.deleteResidence = residence;
    button.setAttribute('data-target', '#deleteModal')
    container?.appendChild(button);
    button.click();
  }

  public onAddResidence(addForm: NgForm): void {
    var residence: Residence = {id:0, reviewsNumber: 0, starsAverage: 1, photo:'', available_from:'', available_till:'', pricing:0.0, city:'', area:"", address:"", floor:0,
      coordinateX: 0.0, coordinateY: 0.0, peopleCapacity:0, roomType:0, comment:'', photos:[], bedNumber:0, bathroomNumber:0, bedroomNumber:0, acreage:0,
      host:this.host, description:'', has_living_room: false, has_wifi:false, has_heating:false, has_air_condition:false, has_cuisine:false, has_tv:false,
      has_parking:false, has_elevator:false, reservations:[]};

    residence.available_from = addForm.value.startDate;
    residence.available_till = addForm.value.endDate;
    residence.city = addForm.value.city;
    residence.area = addForm.value.area;
    residence.address = addForm.value.address;
    residence.coordinateX = this.coordinateX;
    residence.coordinateY = this.coordinateY;
    residence.pricing = addForm.value.pricing;
    residence.floor = addForm.value.floor;
    residence.peopleCapacity = addForm.value.peopleCapacity;
    residence.bedNumber = addForm.value.bedNumber;
    residence.bedroomNumber = addForm.value.bedroomNumber
    residence.bathroomNumber = addForm.value.bathroomNumber
    residence.acreage = addForm.value.acreage
    residence.comment = addForm.value.comment;
    residence.description = addForm.value.description
    residence.roomType = addForm.value.roomType;
    if (addForm.value.living_room) residence.has_living_room = true;
    if (addForm.value.wifi) residence.has_wifi = true;
    if (addForm.value.heating) residence.has_heating = true;
    if (addForm.value.air_condition) residence.has_air_condition = true;
    if (addForm.value.cuisine) residence.has_cuisine = true;
    if (addForm.value.tv) residence.has_tv = true;
    if (addForm.value.parking) residence.has_parking = true;
    if (addForm.value.elevator) residence.has_elevator = true;

    this.residenceService.addResidence(residence).subscribe(
      (response: Residence) => {
        console.log(response);
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
        this.residenceService.getHostResidencesPagination(this.id, 0).subscribe(
          (response: PageResponse) => {
            this.residences = response.response.content;
            this.recordsNumber = response.recordCount;

            if (response.recordCount > 0) this.fromRecord = 1;
            if (response.recordCount <= 10) this.toRecord = response.recordCount;
            else this.toRecord = 10;
        
            var number = Math.floor(response.recordCount / 10);
            if (response.recordCount % 10 !== 0)  this.pages = number + 1;
            else this.pages = number;
        
            this.previousPage = -1;
            if (this.recordsNumber !== this.toRecord) this.nextPage = 1;
            else this.nextPage = -1

            this.currentPage = 0;
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

