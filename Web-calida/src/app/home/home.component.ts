
import { Routes, RouterModule, Router } from '@angular/router';
import { DatosService } from '../datos.service';
import { Registros11 } from '../modelos/Datos11';
import { Invernaderos } from '../modelos/Invernaderos';
import {Component, OnInit, ViewChild,AfterViewInit} from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {FormControl, Validators} from '@angular/forms';
import { NgbDateStruct,NgbCalendar } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  registros11:Registros11 [];
  dropvalue:string//valor actual del drop del invernadero 
  data:Invernaderos;//almacenar los invernaderos
  displayedColumns: string[];
  dataSource = new MatTableDataSource();
  model: NgbDateStruct;
 
  constructor(private datos:DatosService,private router:Router,private calendar: NgbCalendar) {
    this.dataSource = new MatTableDataSource() 

   }


  inver():void
  {
    this.datos.invernaderos().subscribe((res:any )=>{
        this.data=res;
        this.dropvalue=res[0]['Nombre'];
       });
       console.log(this.data)
       this.dropvalue=this.data[0]['Nombre'];
       
  }
  Obtener():void
  {
    var fecha=this.model.year+"-0"+this.model.month+"-"+this.model.day;

    this.registros11=[];
    console.log(fecha);
    this.datos.obtener(fecha,this.dropvalue).subscribe((res:Registros11 [])=>
    {    
      console.log(res);
      if(res.length>0)
      this.dataSource.data=res;
      var aux=[];
      for (var j in res[0])
        aux.push(j);
      this.displayedColumns=aux;
    }); 
   
    this.dataSource.data=this.registros11;

  }

  changeAction(obj)
  {
    this.dropvalue=(obj);
    this.Obtener();
    
    
  }

    
  
  descargarExcel()
  {
    var fecha=this.model.year+"-0"+this.model.month+"-"+this.model.day;
    console.log(this.dataSource.data);
    this.datos.descarga("datos" +this.dropvalue+fecha ,this.dataSource.data,this.displayedColumns);
  }
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  ngOnInit() 
  {
    this.model=this.calendar.getToday()
    this.inver();
    console.log(this.data[0]['Nombre']);
   
    this.dropvalue=this.data[0]['Nombre'];
    this.Obtener();
    this.dataSource.sort = this.sort;
    this.dataSource.sort = this.sort;
    //this.dropvalue="Invernadero"
    

    
  }
  ngAfterViewInit()
  {
 
    this.Obtener();
    this.dataSource.sort = this.sort;
    this.dataSource.sort = this.sort;
   
  }
}
