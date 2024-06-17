import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import axios from 'axios';
import { Base } from '../../../config/helper';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  baseUrl:string=Base.BaseUrl;
  constructor(private router: Router, private route: ActivatedRoute){}
  ngOnInit(): void {
    const token = this.route.snapshot.queryParams['token'];
    if(token){
      localStorage.setItem('token',token);
      this.router.navigate(['/dashboard']);
    }
    if(!localStorage.getItem('token')) {
      this.router.navigate(['/home']);
    }
  }

  logoutUser(){
    localStorage.clear();
    this.logout();
    this.router.navigate(['/home']);
  }
  async logout(){
    try {
      const { data } = await axios.get(`${this.baseUrl}/auth/logout`);
      console.log("Data ::>>", data.data);
    } catch (error) {
      console.log("Login Error :>>",error);
    }
  }
}
