import { Component, OnInit } from '@angular/core';
import { Residence } from '../model/residence';
import { ActivatedRoute } from '@angular/router';
import { ResidenceService } from '../service/residence.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Photo } from '../model/photo';
import { PageResponse } from '../model/pageResponse';

@Component({
  selector: 'app-search-result',
  templateUrl: './search-result.component.html',
  styleUrls: ['./search-result.component.css']
})
export class SearchResultComponent implements OnInit{
  
  public results: Residence[] = [];
  public city: String = "";
  public checkIn: String = "";
  public checkOut: String = "";
  public people: number = 0;
  public noResults: boolean = false;
  public priceLess50: boolean = false;
  public price50_100: boolean = false;
  public price100_200: boolean = false;
  public price200_350: boolean = false;
  public price350_600: boolean = false;
  public price600_1000: boolean = false;
  public priceAbove1000: boolean = false;
  public privateRoom: boolean = false;
  public sharedRoom: boolean = false;
  public wholeBuilding: boolean = false;
  public parking: boolean = false;
  public livingRoom: boolean = false;
  public wifi: boolean = false;
  public heating: boolean = false;
  public airCondition: boolean = false;
  public cuisine: boolean = false;
  public tv: boolean = false;
  public elevator: boolean = false;
  public recordsNumber: number = 0;
  public fromRecord: number = 0;
  public toRecord: number = 0;
  public pages: number = 1;
  public previousPage: number = 0;
  public nextPage: number = 0;
  public currentPage: number = 0;

  constructor(private route: ActivatedRoute, private residenceService: ResidenceService) {}

  ngOnInit(): void {
    this.getResults();
  }

  createRange(number: number){
    return new Array(number);
  }

  public getResults(): void {
    this.route.queryParams.subscribe((queryParam) => {
      this.city = queryParam?.["city"];
      this.checkIn = queryParam?.["check_in"];
      this.checkOut = queryParam?.["check_out"];
      this.people = queryParam?.["people"];

      this.residenceService.getResidencesBySearchPagination(this.city, this.checkIn, this.checkOut, this.people, 0).subscribe(
        (response: PageResponse) => {
          this.results = response.response;
          this.recordsNumber = response.recordCount;

          if (response.recordCount > 0) this.fromRecord = 1;
          if (response.recordCount <= 10) this.toRecord = response.recordCount;
          else this.toRecord = 10;
      
          var number = Math.floor(response.recordCount / 10);
          if (response.recordCount % 10 !== 0)  this.pages = number + 1;
          else this.pages = number;
      
          this.previousPage = -1;
          if (this.recordsNumber !== this.toRecord) this.nextPage = 1;
          else this.nextPage = -1; 
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
          console.log(response);
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      );
    })
  }

  onChangePage(page: number): void {
    this.residenceService.getResidencesBySearchPagination(this.city, this.checkIn, this.checkOut, this.people, page).subscribe(
      (response: PageResponse) => {
        this.results = response.response;
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
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }

  public refresh(): void {
    window.location.reload();
  }

}
