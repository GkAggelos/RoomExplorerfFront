import { Component, OnInit } from '@angular/core';
import { Residence } from '../model/residence';
import { ResidenceService } from '../service/residence.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-host',
  templateUrl: './host.component.html',
  styleUrls: ['./host.component.css']
})
export class HostComponent implements OnInit{

  public residences: Residence[];

  constructor(private residenceService: ResidenceService){this.residences = [];}

  ngOnInit(): void {
    this.getResidences();
  }

  public getResidences(): void {
    this.residenceService.getResidences().subscribe(
      (response: Residence[])=> {
        this.residences = response;
        console.log(this.residences);
      },
      (error: HttpErrorResponse) => {
          alert(error.message);
      }
    );
  }

  public onAddResidence(addForm: NgForm): void {
    this.residenceService.addResidence(addForm.value).subscribe(
      (response: Residence) => {
        console.log(response);
      },
      (error: HttpErrorResponse) => {
        alert(error.message);
      }
    );
  }
}
