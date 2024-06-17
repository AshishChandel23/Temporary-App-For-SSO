import { Component, OnInit } from '@angular/core';
import { getDecodedAccessToken } from '../../../../config/helper';
import { Router } from '@angular/router';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css']
})
export class BaseComponent implements OnInit {

  token: any;
  hasToken = localStorage.getItem("token");
  constructor(private router: Router) {}

  name: string = "Ashish";
  email: string = 'ashish@gmail.com';
  contactNo: string = "7768249437";
  passportNo: string = "45789q758752";
  city: string = "noida";
  state: string = "uttar pradesh";
  country: string = "india";

  ngOnInit(): void {
    this.token = getDecodedAccessToken();
    if (!this.hasToken) {
      this.router.navigate(['/home']);
      return;
    }
    console.log("token", this.token);
    this.name = this.token.firstName+" "+this.token.lastName;
    this.email = this.token.email;
    this.contactNo = this.token.contactNo;
    this.city = this.token.city;
    this.state = this.token.state;
    this.country = this.token.country;
  }
}
