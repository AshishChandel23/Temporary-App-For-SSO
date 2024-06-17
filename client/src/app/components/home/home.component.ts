import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Base } from '../../../config/helper';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  baseUrl:string = Base.BaseUrl;
  ngOnInit(): void {
    
  }
  async loginUser(){
    try {
      const { data } = await axios.get(`${this.baseUrl}/auth/login`);
      if(!data.error){
        window.location.href = data.redirectUrl;
      }
    } catch (error) {
      console.log("Login Error :>>",error);
    }
  }
}
