import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { User } from "../modelos/User";
import { LogginComponent } from '../com/log/loggin/loggin.component';
import {LogginService} from '../log/loggin.service'


@Injectable({
  providedIn: 'root'
})
export class VerificacionGuard implements CanActivate {
  constructor(private service:LogginService,private router:Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    
     if(!this.service.checklog())
     {
       this.router.navigate(["/Login"]);
       return false;

     }
     return true;
      
    

  }
  
}
