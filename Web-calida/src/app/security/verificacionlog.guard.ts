import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import {LogginService} from '../log/loggin.service'


@Injectable({
  providedIn: 'root'
})

export class VerificacionlogGuard implements CanActivate {
  constructor(private service:LogginService,private router:Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      if(this.service.checklog())
      {
        this.router.navigate(["/home"]);
        return false;
 
      }
      return true;
  }
  
}
