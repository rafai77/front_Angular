import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LogginService } from '../log/loggin.service';
import { NgbNav } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-bar',
  templateUrl: './bar.component.html',
  styleUrls: ['./bar.component.css']
})
export class BarComponent implements OnInit {

  constructor(private servicelog:LogginService,private router:Router) { }

  Logout():void
  {
  
    this.servicelog.logout();
    this.router.navigateByUrl('/Login');
  }

  ngOnInit(): void {
  }

}
