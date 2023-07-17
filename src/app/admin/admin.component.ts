import { Component, OnInit } from '@angular/core';
import { Renter } from '../model/renter';
import { Host } from '../model/host';
import { HostService } from '../host.service';
import { HttpErrorResponse } from '@angular/common/http';
import { RenterService } from '../renter.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {
  public hosts: Host[];
  public renters: Renter[];

  constructor(private hostService: HostService, private renterService: RenterService) { this.hosts = []; this.renters = [];}

  ngOnInit(): void {
    this.getHosts();
    this.getRenters();
  }

  public getHosts(): void {
    this.hostService.getHosts().subscribe(
      (response: Host[]) => {
        this.hosts = response;
        console.log(this.hosts);
      },
      (error: HttpErrorResponse) => {
          alert(error.message);
      }
    );
  }

  public getRenters(): void {
    this.renterService.getRenters().subscribe(
      (response: Renter[]) => {
        this.renters = response;
        console.log(this.renters);
      },
      (error: HttpErrorResponse) => {
          alert(error.message);
      }
    );
  }
}
