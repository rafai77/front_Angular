import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/';
import { User } from "../modelos/User";
import { Jwt } from "../modelos/jwt";
import { tap } from 'rxjs/operators';
import { Routes, RouterModule, Router } from '@angular/router';



@Injectable({
  providedIn: 'root'
})
export class LogginService {
//private Dominio = 'http://192.168.1.25:3000';
  private Dominio ='http://localhost:3000'
  private token:string ;// tk
  private user:string;//
  private info:Jwt;//informacion de la resupesta
  private log:boolean=false;

  constructor(private http: HttpClient,private router:Router) {

    this.token=localStorage.getItem('tk');
    this.user=localStorage.getItem('user')
    console.log(this.user);
    if(this.token)
    this.log=true;
    else
    {
      this.log=false
      this.token="";
    }

  }

  checklog():boolean
  {
    return this.log;
  }
  guardaruserId(id:number):void//guarda el usuario
  {
    localStorage.setItem('user',`${id}`);
    console.log(`l${id}`)
    this.user=id.toString();
  }

    login(user:User): Observable<Jwt>
    {
      return this.http.post<Jwt>(`${this.Dominio}/loggin`,
      user).pipe(tap(
        (res:Jwt)=>
        {
          if(res)
          {
            //guardar token
            console.log(res)
            this.log=true;
            //console.log(res.user.id)
            this.guardaruserId(res.user.id);
            this.guardartk(res.token);
          }
          {
            //eror al iniciar sesion
          }
        }
      ))
    }

    logout()
    {
      this.token= ' '
      this.log=false;
      localStorage.removeItem('tk');
    }
    private guardartk(token:string): void{
        localStorage.setItem('tk',token);
        this.token=token;

    }
    getname():string
    {
      return (!this.user)?this.token=localStorage.getItem('user'):this.user;
    }

    gettk():string
    {
      return (!this.token)?this.token=localStorage.getItem('tk'):this.token;
    }



}
