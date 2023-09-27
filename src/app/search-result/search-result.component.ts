import { Component, OnInit } from '@angular/core';
import { Residence } from '../model/residence';
import { ActivatedRoute, Router } from '@angular/router';
import { ResidenceService } from '../service/residence.service';
import { HttpErrorResponse } from '@angular/common/http';
import { Photo } from '../model/photo';
import { PageResponse } from '../model/pageResponse';
import { SearchService } from '../service/search.service';
import { Search } from '../model/search';
import { JwtHelperService } from '@auth0/angular-jwt';
import { RenterService } from '../service/renter.service';
import { Renter } from '../model/renter';

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
  public minPageNumber: number = 0;
  public maxPageNumber: number = 0;
  public maxPages: number = 0;
  public previousPage: number = 0;
  public nextPage: number = 0;
  public currentPage: number = 0;
  public price: string = "";
  public roomType: string = "";

  constructor(private route: ActivatedRoute, private residenceService: ResidenceService, private searchService: SearchService, private renterService: RenterService, private rooter: Router, private jwtHelper: JwtHelperService) {}

  ngOnInit(): void {
    this.getResults();
  }

  public updateSearchHistory(residence: Residence): void {
    var token = localStorage.getItem("token");
    console.log(token);
    if (token !== null) {
      let decodedJwtData = this.jwtHelper.decodeToken(token);
      let userId = decodedJwtData.jti;
      this.renterService.getRenterById(userId).subscribe(
        (response: Renter) => { 
          this.rooter.navigateByUrl(`/residence?id=${residence.id}&host=false&renter=true&check_in=${this.checkIn}&check_out=${this.checkOut}`);
          var search: Search = {id: 0, renter: response, residence: residence};
          this.searchService.addSearch(search).subscribe(
            (respone: Search) => {
              console.log(respone);
            },
            (error: HttpErrorResponse) => {
              alert(error.message);
            }
          )
        },
        (error: HttpErrorResponse) => {
          alert(error.message);
        }
      )
    }
    else{
      this.rooter.navigateByUrl(`/residence?id=${residence.id}&host=false&renter=true&check_in=${this.checkIn}&check_out=${this.checkOut}`);
    } 
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
      this.roomType = queryParam?.["roomType"];
      this.price = queryParam?.["price"];
      if (this.roomType.indexOf('p') != -1) this.privateRoom = true;
      if (this.roomType.indexOf('s') != -1) this.sharedRoom = true;
      if (this.roomType.indexOf('w') != -1) this.wholeBuilding = true;
      if (queryParam?.["parking"] == 'true') this.parking = true;
      if (queryParam?.["livingRoom"] == 'true') this.livingRoom = true;
      if (queryParam?.["wifi"] == 'true') this.wifi = true;
      if (queryParam?.["heating"] == 'true') this.heating = true;
      if (queryParam?.["airCondition"] == 'true') this.airCondition = true;
      if (queryParam?.["cuisine"] == 'true') this.cuisine = true;
      if (queryParam?.["tv"] == 'true') this.tv = true;
      if (queryParam?.["elevator"] == 'true') this.elevator = true;

      this.residenceService.getResidencesBySearchPaginationFilter(this.city, this.checkIn, this.checkOut, this.people, 0, this.roomType, this.parking, this.livingRoom,
                                                                this.wifi, this.heating, this.airCondition, this.cuisine, this.tv, this.elevator, this.price).subscribe(
        (response: PageResponse) => {
          this.results = response.response;
          
          this.recordsNumber = response.recordCount;
          this.currentPage = 0;

          if (response.recordCount > 0) this.fromRecord = 1;
          if (response.recordCount <= 10) {
            this.toRecord = response.recordCount;
            this.maxPages = 1;
            this.maxPageNumber = response.recordCount - 1;
          }
          else {
            this.maxPageNumber = 9;
            this.toRecord = 10;
          }
      
          var number = Math.floor(response.recordCount / 10);
          if (response.recordCount % 10 !== 0)  this.pages = number + 1;
          else this.pages = number;

          if (this.pages > 10) this.maxPages = 10;
          else this.maxPages = this.pages;
      
          this.previousPage = -1;
          if (this.recordsNumber !== this.toRecord) this.nextPage = 1;
          else this.nextPage = -1; 

          if (this.results.length == 0){ 
            this.noResults = true;
            this.fromRecord = 0;
          }
          else {
            this.noResults = false;
          }
          
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
    });
  }

  public getResultsFilter(filter: string): void {
    this.roomType = '';

    if (filter === 'anyPrice') this.price = 'anyPrice';

    if (filter === 'priceLess50') this.price = 'priceLess50';
    
    if (filter === 'price50_100') this.price = 'price50_100';

    if (filter === 'price100_200') this.price = 'price100_200';

    if (filter === 'price200_350') this.price = 'price200_350';

    if (filter === 'price350_600') this.price = 'price350_600';

    if (filter === 'price600_1000') this.price = 'price600_1000';

    if (filter === 'priceAbove1000') this.price = 'priceAbove1000';

    if (filter === 'privateRoom') {
      if (this.privateRoom) this.privateRoom = false;
      else this.privateRoom = true;
    }
    if (filter === 'sharedRoom') {
      if (this.sharedRoom) this.sharedRoom = false;
      else this.sharedRoom = true;
    }
    if (filter === 'wholeBuilding') {
      if (this.wholeBuilding) this.wholeBuilding = false;
      else this.wholeBuilding = true;
    }
    if (filter === 'parking') {
      if (this.parking) this.parking = false;
      else this.parking = true;
    }
    if (filter === 'livingRoom') {
      if (this.livingRoom) this.livingRoom = false;
      else this.livingRoom = true;
    }
    if (filter === 'wifi') {
      if (this.wifi) this.wifi = false;
      else this.wifi = true;
    }
    if (filter === 'heating') {
      if (this.heating) this.heating = false;
      else this.heating = true;
    }
    if (filter === 'airCondition') {
      if (this.airCondition) this.airCondition = false;
      else this.airCondition = true;
    }
    if (filter === 'cuisine') {
      if (this.cuisine) this.cuisine = false;
      else this.cuisine = true;
    }
    if (filter === 'tv') {
      if (this.tv) this.tv = false;
      else this.tv = true;
    }
    if (filter === 'elevator') {
      if (this.elevator) this.elevator = false;
      else this.elevator = true;
    }

    if (this.privateRoom) this.roomType = this.roomType.concat('p');
    if (this.sharedRoom) this.roomType = this.roomType.concat('s');
    if (this.wholeBuilding) this.roomType = this.roomType.concat('w');

    this.rooter.navigateByUrl(`/search?city=${this.city}&check_in=${this.checkIn}&check_out=${this.checkOut}&people=${this.people}&roomType=${this.roomType}&price=${this.price}&parking=${this.parking}&livingRoom=${this.livingRoom}&wifi=${this.wifi}&heating=${this.heating}&airCondition=${this.airCondition}&cuisine=${this.cuisine}&tv=${this.tv}&elevator=${this.elevator}`);
  }

  onChangePage(page: number): void {
    this.residenceService.getResidencesBySearchPaginationFilter(this.city, this.checkIn, this.checkOut, this.people, page, this.roomType, this.parking, this.livingRoom,
      this.wifi, this.heating, this.airCondition, this.cuisine, this.tv, this.elevator, this.price).subscribe(
      (response: PageResponse) => {
        this.results = response.response;
        this.recordsNumber = response.recordCount;
        this.currentPage = page;

        if (page > this.maxPageNumber) {
          this.maxPageNumber = this.maxPageNumber + 1;
          this.minPageNumber = this.minPageNumber + 1;
        }

        if (page < this.minPageNumber) {
          this.maxPageNumber = this.maxPageNumber - 1;
          this.minPageNumber = this.minPageNumber - 1;
        }

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
}
