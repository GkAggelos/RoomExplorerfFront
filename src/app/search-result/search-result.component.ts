import { Component, OnInit } from '@angular/core';
import { Residence } from '../model/residence';
import { ActivatedRoute } from '@angular/router';
import { ResidenceService } from '../service/residence.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Photo } from '../model/photo';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit{
  
  public results: Residence[] = [];
  public location: String = "";
  public checkIn: String = "";
  public checkOut: String = "";
  public people: number = 0;
  public noResults: boolean = false;

  constructor(private route: ActivatedRoute, private residenceService: ResidenceService) {}

  ngOnInit(): void {
    this.getResults();
  }

  public getResults(): void {
    this.route.queryParams.subscribe((queryParam) => {
      this.location = queryParam?.["location"];
      this.checkIn = queryParam?.["check_in"];
      this.checkOut = queryParam?.["check_out"];
      this.people = queryParam?.["people"];

      this.residenceService.getResidencesBySearch(this.location, this.checkIn, this.checkOut, this.people).subscribe(
        (response: Residence[]) => {
          this.results = response;
<<<<<<< HEAD
          if (this.results.length == 0) this.noResults = true;
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
=======
>>>>>>> a359ba0a89ca52acdaf4494bc02f7ed8b5cf0b30
          console.log(response);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    })
  }

}
