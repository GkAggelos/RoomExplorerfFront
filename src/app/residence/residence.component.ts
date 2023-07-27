import { Component, OnInit } from '@angular/core';
import { Residence } from '../model/residence';
import { ResidenceService } from '../service/residence.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';
import { Photo } from '../model/photo';
import { PhotoService } from '../service/photo.service';

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

  constructor(private route: ActivatedRoute, private residenceService: ResidenceService, private photoService: PhotoService) { 
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
  
    this.residence = {id:0, pricing:0.0, location:'', area:0, floor:0, peopleCapacity:0, roomType:0, comment:'', photos:[], bedNumber:0, bathroomNumber:0, bedroomNumber:0, acreage:0,
    host:{ id:1, username:'', firstName:'', lastName:'', password:'', email:'', phoneNumber: '', approved:true}, 
    description:'', has_living_room: false, has_wifi:false, has_heating:false, has_air_condition:false, has_cuisine:false, has_tv:false, has_parking:false, has_elevator:false, reservations:[]};
    this.deletePhoto = {id:0, url:'', residence: this.residence};
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

      this.residenceService.getResidenceById(this.id).subscribe(
        (response: Residence) => {
          this.residence = response;
          this.isWifiChecked = this.residence.has_wifi;
          this.isHeatingChecked = this.residence.has_heating;
          this.isAirConditionChecked = this.residence.has_air_condition;
          this.isCuisineChecked = this.residence.has_cuisine;
          this.isTvChecked = this.residence.has_tv;
          this.isParkingChecked = this.residence.has_parking;
          this.isElevatorChecked = this.residence.has_elevator;
          this.isLivingRoomChecked = this.residence.has_living_room;
          this.residenceService.getPhotosByResidenceId(response.id).subscribe(
            (response: Photo[]) => {
              this.photos = response;
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
    });
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
    button.setAttribute('data-target', '#deleteModal')
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
            alert(error.message);
          }
        );
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public onEditResidence(editForm: NgForm): void {

    this.residence.location = editForm.value.location;
    this.residence.area = editForm.value.area;
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
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

}