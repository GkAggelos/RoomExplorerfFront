import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit{

  public people: string = "";

  constructor(private route: Router) {}

  public ngOnInit(): void {
    this.people = "Select number of persons";
  }

  public NoneSelected(searchForm: NgForm): boolean {
    if (searchForm.value.people === "Select number of persons") return true;
    return false;
  }

  public onSearch(searchForm: NgForm): void {
    this.route.navigateByUrl(`/search?location=${searchForm.value.location}&check_in=${searchForm.value.check_in}&check_out=${searchForm.value.check_out}&people=${searchForm.value.people}`);
  }
}
