import { Component, OnInit } from '@angular/core';
import { Renter } from '../model/renter';
import { Host } from '../model/host';
import { HostService } from '../service/host.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RenterService } from '../service/renter.service';
import { PageResponse } from '../model/pageResponse';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public hosts: Host[];
  public renters: Renter[];
  public hostRecordsNumber: number = 0;
  public hostFromRecord: number = 0;
  public hostToRecord: number = 0;
  public hostPages: number = 1;
  public hostPreviousPage: number = 0;
  public hostNextPage: number = 0;
  public hostCurrentPage: number = 0;
  public hostMinPageNumber: number = 0;
  public hostMaxPageNumber: number = 0;
  public hostMaxPages: number = 0;
  public renterRecordsNumber: number = 0;
  public renterFromRecord: number = 0;
  public renterToRecord: number = 0;
  public renterPages: number = 1;
  public renterPreviousPage: number = 0;
  public renterNextPage: number = 0;
  public renterCurrentPage: number = 0;
  public renterMinPageNumber: number = 0;
  public renterMaxPageNumber: number = 0;
  public renterMaxPages: number = 0;
  public unauthorized: boolean = false;

  constructor(private hostService: HostService, private renterService: RenterService) { this.hosts = []; this.renters = [];}

  ngOnInit(): void {
    this.getHosts();
    this.getRenters();
  }

  public getHosts(): void {
    this.hostService.getHostsPagination(0).subscribe(
      (response: PageResponse) => {
        this.hosts = response.response.content;
        this.hostRecordsNumber = response.recordCount;

        if (response.recordCount > 0) this.hostFromRecord = 1;
        if (response.recordCount <= 10) { 
          this.hostToRecord = response.recordCount;
          this.hostMaxPages = 1;
          this.hostMaxPageNumber = response.recordCount - 1;
        }
        else {
          this.hostMaxPageNumber = 9; 
          this.hostToRecord = 10;
        }

        var number = Math.floor(response.recordCount / 10);
        if (response.recordCount % 10 !== 0)  this.hostPages = number + 1;
        else this.hostPages = number;
    
        if (this.hostPages > 10)  this.hostMaxPages = 10;
        else  this.hostMaxPages = this.hostPages;

        this.hostPreviousPage = -1;
        if (this.hostRecordsNumber !== this.hostToRecord) this.hostNextPage = 1;
        else this.hostNextPage = -1; 
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

  public getRenters(): void {
    this.renterService.getRentersPagination(0).subscribe(
      (response: PageResponse) => {
        this.renters = response.response.content;
        this.renterRecordsNumber = response.recordCount;

        if (response.recordCount > 0) this.renterFromRecord = 1;
        if (response.recordCount <= 10) {
          this.renterToRecord = response.recordCount;
          this.renterMaxPages = 1;
          this.renterMaxPageNumber = response.recordCount - 1;
        }
        else {
          this.renterMaxPageNumber = 9;
          this.renterToRecord = 10;
        }
    
        var number = Math.floor(response.recordCount / 10);
        if (response.recordCount % 10 !== 0)  this.renterPages = number + 1;
        else this.renterPages = number;
    
        if (this.renterPages > 10) this.renterMaxPages = 10;
        else this.renterMaxPages = this.renterPages;

        this.renterPreviousPage = -1;
        if (this.renterRecordsNumber !== this.renterToRecord) this.renterNextPage = 1;
        else this.renterNextPage = -1; 
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

  public onChangePageForHost(page: number) {
    this.hostService.getHostsPagination(page).subscribe(
      (response: PageResponse) => {
        this.hosts = response.response.content;
        this.hostRecordsNumber = response.recordCount;
        this.hostCurrentPage = page;

        if (page > this.hostMaxPageNumber) {
          this.hostMaxPageNumber = this.hostMaxPageNumber + 1;
          this.hostMinPageNumber = this.hostMinPageNumber + 1;
        }

        if (page < this.hostMinPageNumber) {
          this.hostMaxPageNumber = this.hostMaxPageNumber - 1;
          this.hostMinPageNumber = this.hostMinPageNumber - 1;
        }

        this.hostFromRecord = 1;
        if (response.recordCount <= 10) this.hostToRecord = response.recordCount;
        else this.hostToRecord = 10;
        
        for (let index = 0; index < page; index++) {
          this.hostFromRecord += 10;
          this.hostToRecord += 10;
        }
        if (this.hostToRecord > response.recordCount) this.hostToRecord = response.recordCount;

        this.hostPreviousPage = page - 1;
        if (response.recordCount !== this.hostToRecord) this.hostNextPage = page + 1;
        else this.hostNextPage = -1; 
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

  public onChangePageForRenter(page: number) {
    this.renterService.getRentersPagination(page).subscribe(
      (response: PageResponse) => {
        this.renters = response.response.content;
        this.renterRecordsNumber = response.recordCount;
        this.renterCurrentPage = page;

        if (page > this.renterMaxPageNumber) {
          this.renterMaxPageNumber = this.renterMaxPageNumber + 1;
          this.renterMinPageNumber = this.renterMinPageNumber + 1;
        }

        if (page < this.renterMinPageNumber) {
          this.renterMaxPageNumber = this.renterMaxPageNumber - 1;
          this.renterMinPageNumber = this.renterMinPageNumber - 1;
        }

        this.renterFromRecord = 1;
        if (response.recordCount <= 10) this.renterToRecord = response.recordCount;
        else this.renterToRecord = 10;

        for (let index = 0; index < page; index++) {
          this.renterFromRecord += 10;
          this.renterToRecord += 10;
        }
        if (this.renterToRecord > response.recordCount) this.renterToRecord = response.recordCount;

        this.renterPreviousPage = page - 1;
        if (response.recordCount !== this.renterToRecord) this.renterNextPage = page + 1;
        else this.renterNextPage = -1; 
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
