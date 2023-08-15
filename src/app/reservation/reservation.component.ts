import { Component, OnInit } from '@angular/core';
import { ReservationService } from '../service/reservation.service';
import { Reservation } from '../model/reservation';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-reservation',
  templateUrl: './reservation.component.html',
  styleUrls: ['./reservation.component.css']
})
export class ReservationComponent implements OnInit {

  public reservation: Reservation = {id:0, stars:0, review:'', reservationDate:'', arrivalDate:'', leaveDate:'', state:-1, 
            renter:{id:0, username:'', firstName:'', lastName:'', password:'', email:'', phoneNumber: '', photo: ''},
            residence:{id:0, photo:'', available_from:'', available_till:'', pricing:0.0, location:'', area:0, floor:0, peopleCapacity:0, roomType:0, comment:'', photos:[], bedNumber:0, bathroomNumber:0, bedroomNumber:0, acreage:0,
            host:{ id:0, username:'', firstName:'', lastName:'', password:'', email:'', phoneNumber: '', photo: '', approved:true}, 
            description:'', has_living_room: false, has_wifi:false, has_heating:false, has_air_condition:false, has_cuisine:false, has_tv:false, has_parking:false, has_elevator:false, reservations:[]}
  };
  public id: number = 0;

  constructor(private reservationService: ReservationService, private route: ActivatedRoute) {}

  public onAddReview(reviewForm: NgForm): void {
    this.reservation.review = reviewForm.value.review;
    this.reservation.stars = parseInt(reviewForm.value.rating1);
    this.reservationService.updateReservation(this.reservation).subscribe(
      (response: Reservation) => {
        this.reservation = response;
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public emptyRadio(reviewForm: NgForm): boolean {
    if (reviewForm.value.rating1) return false;
    return true;
  }

  public ngOnInit(): void {
    this.route.queryParams.subscribe((queryParam) =>{
      var temp = queryParam?.['id'];
      this.id = parseInt(temp);

      this.reservationService.getReservationById(this.id).subscribe(
        (response: Reservation) => {
          this.reservation = response;
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    });
  }
}
