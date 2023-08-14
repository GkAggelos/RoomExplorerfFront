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

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css']
})
export class HostComponent implements OnInit{

  public residences: Residence[];
  public deleteResidence: Residence = {id:0, photo:'',available_from:'', available_till:'', pricing:0.0, location:'', area:0, floor:0, peopleCapacity:0, roomType:0, comment:'', photos:[], bedNumber:0, bathroomNumber:0, bedroomNumber:0, acreage:0,
  host:{id:0, username:'', firstName:'', lastName:'', password:'', email:'', phoneNumber: '', photo:'', approved:false}, description:'', has_living_room: false, has_wifi:false, has_heating:false, has_air_condition:false, has_cuisine:false, has_tv:false,
  has_parking:false, has_elevator:false, reservations:[]};
  public urls: String[];
  public names: String[];
  public id: number = 0;
  public host: Host = {id:0, username:'', firstName:'', lastName:'', password:'', email:'', phoneNumber: '', photo:'', approved:false};
  public photos: Photo[] = [];

  constructor(private residenceService: ResidenceService, private photoService: PhotoService, private route: ActivatedRoute, private hostServise: HostService) {
    this.residences = [];
    this.urls = [];
    this.names = [];
  }

  ngOnInit(): void {
    var temp: string;
    this.route.queryParams.subscribe((queryParam) =>{
      temp = queryParam?.['id'];
      this.id = parseInt(temp);
      this.getHost();
      this.getResidences();
    });
  }

  public getHost(): void {
    this.hostServise.getHostById(this.id).subscribe(
      (response: Host) => {
        this.host = response;
        console.log(response);
      },
      (error: HttpErrorResponse) => {
          alert(error.message);
      }
    );
  }

  public getResidences(): void {
    this.residenceService.getHostResidences(this.id).subscribe(
      (response: Residence[])=> {
        this.residences = response;
        console.log(this.residences);
      },
      (error: HttpErrorResponse) => {
          alert(error.message);
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
        this.residenceService.getHostResidences(this.id).subscribe(
          (response: Residence[])=> {
            this.residences = response;
            console.log(this.residences);
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
    var residence: Residence = {id:0, photo:'', available_from:'', available_till:'', pricing:0.0, location:'', area:0, floor:0, peopleCapacity:0, roomType:0, comment:'', photos:[], bedNumber:0, bathroomNumber:0, bedroomNumber:0, acreage:0,
      host:this.host, description:'', has_living_room: false, has_wifi:false, has_heating:false, has_air_condition:false, has_cuisine:false, has_tv:false,
      has_parking:false, has_elevator:false, reservations:[]};

    residence.available_from = addForm.value.startDate;
    residence.available_till = addForm.value.endDate;
    residence.location = addForm.value.location;
    residence.area = addForm.value.area;
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
              alert(error.message);
            }
          );
        }
        this.residenceService.getHostResidences(this.id).subscribe(
          (response: Residence[])=> {
            this.residences = response;
            console.log(this.residences);
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

