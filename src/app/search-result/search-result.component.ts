import { Component, OnInit } from '@angular/core';
import { Residence } from '../model/residence';
import { ActivatedRoute } from '@angular/router';
import { ResidenceService } from '../service/residence.service';
import { HttpErrorResponse } from '@angular/common/http';

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
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    })
  }

}
