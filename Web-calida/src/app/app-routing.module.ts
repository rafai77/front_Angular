import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {LogginComponent} from './com/log/loggin/loggin.component'
import {HomeComponent} from './home/home.component'
import {VerificacionGuard} from './security/verificacion.guard'
import {VerificacionlogGuard} from './security/verificacionlog.guard'
import{BarComponent} from './bar/bar.component'





const routes: Routes = [
  {path:'',redirectTo:'Login',pathMatch:'full',},
  {path:'Login',component:LogginComponent,canActivate:[VerificacionlogGuard]},
  {path:'home',component:HomeComponent,canActivate:[VerificacionGuard]},
 
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
