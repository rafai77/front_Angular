import { Component, OnInit } from '@angular/core';
import { Routes, RouterModule, Router } from '@angular/router';
import {LogginService} from '../../../log/loggin.service'
import {User} from '../../../modelos/User'

@Component({
  selector: 'app-loggin',
  templateUrl: './loggin.component.html',
  styleUrls: ['./loggin.component.css']
})
export class LogginComponent implements OnInit {

  constructor(private servicelog:LogginService, private rotuer: Router) { }

  ngOnInit() {

  }
  onLogin(form):void
  {
    this.servicelog.login(form.value).subscribe(res=>
      {
        (res.error==true)?console.log("nel"):this.rotuer.navigateByUrl('home');
      }
      );

  }

}
